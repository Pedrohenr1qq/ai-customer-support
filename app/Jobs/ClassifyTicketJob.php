<?php

namespace App\Jobs;

use App\Ai\Agents\TicketTriageAgent;
use App\Enums\TicketCategory;
use App\Enums\TicketPriority;
use App\Enums\TicketStatus;
use App\Models\Department;
use App\Models\Ticket;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use RuntimeException;
use Throwable;

class ClassifyTicketJob implements ShouldQueue
{
    use Queueable;

    public int $tries = 3;

    public function __construct(
        public readonly Ticket $ticket,
    ) {}

    /**
     * Exponential backoff (in seconds) between retry attempts.
     *
     * @return array<int, int>
     */
    public function backoff(): array
    {
        return [10, 30, 60];
    }

    public function handle(): void
    {
        $ticket = $this->ticket->fresh();

        if (! $ticket || $ticket->current_status === TicketStatus::Resolved) {
            return;
        }

        if ($ticket->current_status !== TicketStatus::Processing) {
            $ticket->transitionTo(
                TicketStatus::Processing,
                'job',
                notes: "Attempt {$this->attempts()} of {$this->tries} started.",
            );
        }

        $startedAt = hrtime(true);

        $response = TicketTriageAgent::make()->prompt(
            "Customer Name: {$ticket->customer_name}\nSubject: ".($ticket->subject_raw ?? 'N/A')."\nMessage:\n{$ticket->message}"
        );

        $latencyMs = (int) round((hrtime(true) - $startedAt) / 1_000_000);
        $structured = $response->structured;

        $validator = Validator::make($structured, [
            'category' => ['required', Rule::in(array_column(TicketCategory::cases(), 'value'))],
            'priority' => ['required', Rule::in(array_column(TicketPriority::cases(), 'value'))],
            'subject' => ['required', 'string', 'max:255'],
            'confidence' => ['required', 'numeric', 'min:0', 'max:1'],
            'suggested_reply' => ['required', 'string', 'min:5'],
        ]);

        if ($validator->fails()) {
            throw new RuntimeException('Invalid AI structured output: '.$validator->errors()->first());
        }

        $data = $validator->validated();
        $category = TicketCategory::from($data['category']);
        $department = Department::where('slug', $category->departmentSlug())->first();

        DB::transaction(function () use ($ticket, $data, $department, $response, $latencyMs) {
            $ticket->classifications()->create([
                'provider' => $response->meta->provider ?? config('ai.default', 'gemini'),
                'model_name' => $response->meta->model ?? 'gemini-2.0-flash',
                'category' => $data['category'],
                'priority' => $data['priority'],
                'subject' => $data['subject'],
                'confidence' => (float) $data['confidence'],
                'suggested_reply' => $data['suggested_reply'],
                'raw_payload' => $data,
                'latency_ms' => $latencyMs,
            ]);

            $ticket->update([
                'department_id' => $department?->id,
                'error_reason' => null,
            ]);

            $ticket->transitionTo(
                TicketStatus::AwaitingReview,
                'ai',
                notes: sprintf(
                    'Classified as %s (%s priority, %.0f%% confidence). Routed to %s.',
                    $data['category'],
                    $data['priority'],
                    ((float) $data['confidence']) * 100,
                    $department?->name ?? 'Unassigned',
                ),
            );
        });
    }

    /**
     * Route the ticket to manual human triage after all AI retry attempts fail.
     */
    public function failed(?Throwable $exception): void
    {
        $ticket = $this->ticket->fresh();

        if (! $ticket) {
            return;
        }

        $manualDepartment = Department::where('slug', 'manual_triage')->first();
        $reason = $exception?->getMessage() ?? 'AI classification failed after maximum retries.';

        DB::transaction(function () use ($ticket, $manualDepartment, $reason) {
            $ticket->update([
                'department_id' => $manualDepartment?->id,
                'error_reason' => $reason,
            ]);

            $ticket->transitionTo(
                TicketStatus::FallbackManual,
                'job',
                notes: "Fallback triggered after {$this->tries} failed AI attempts: {$reason}",
            );
        });
    }
}
