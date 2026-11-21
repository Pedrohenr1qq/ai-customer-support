<?php

namespace Tests\Feature\Jobs;

use App\Ai\Agents\TicketTriageAgent;
use App\Enums\TicketStatus;
use App\Jobs\ClassifyTicketJob;
use App\Models\Department;
use App\Models\Ticket;
use Database\Seeders\DepartmentSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use RuntimeException;
use Tests\TestCase;

class ClassifyTicketJobTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(DepartmentSeeder::class);
    }

    public function test_job_classifies_ticket_and_records_lifecycle_history(): void
    {
        TicketTriageAgent::fake([[
            'category' => 'billing',
            'priority' => 'high',
            'subject' => 'Duplicate credit card charge',
            'confidence' => 0.96,
            'suggested_reply' => 'We apologize for the duplicate charge and have initiated a refund.',
        ]]);

        $ticket = Ticket::create([
            'customer_name' => 'John Smith',
            'customer_email' => 'john@example.com',
            'message' => 'I was charged twice on my invoice #400.',
            'current_status' => TicketStatus::Queued,
        ]);

        $job = new ClassifyTicketJob($ticket);
        $job->handle();

        $ticket->refresh();
        $billingDept = Department::where('slug', 'billing')->firstOrFail();

        $this->assertSame(TicketStatus::AwaitingReview, $ticket->current_status);
        $this->assertSame($billingDept->id, $ticket->department_id);

        $this->assertDatabaseHas('ai_classifications', [
            'ticket_id' => $ticket->id,
            'category' => 'billing',
            'priority' => 'high',
        ]);

        $this->assertDatabaseHas('ticket_status_histories', [
            'ticket_id' => $ticket->id,
            'from_status' => TicketStatus::Queued->value,
            'to_status' => TicketStatus::Processing->value,
        ]);

        $this->assertDatabaseHas('ticket_status_histories', [
            'ticket_id' => $ticket->id,
            'from_status' => TicketStatus::Processing->value,
            'to_status' => TicketStatus::AwaitingReview->value,
        ]);
    }

    public function test_job_has_exponential_backoff_and_routes_to_manual_fallback_on_failure(): void
    {
        $ticket = Ticket::create([
            'customer_name' => 'Alice',
            'customer_email' => 'alice@example.com',
            'message' => 'My webhook endpoint is returning 500.',
            'current_status' => TicketStatus::Processing,
        ]);

        $job = new ClassifyTicketJob($ticket);
        $this->assertSame([10, 30, 60], $job->backoff());
        $this->assertSame(3, $job->tries);

        $job->failed(new RuntimeException('Gemini API 503 Service Unavailable'));

        $ticket->refresh();
        $manualDept = Department::where('slug', 'manual_triage')->firstOrFail();

        $this->assertSame(TicketStatus::FallbackManual, $ticket->current_status);
        $this->assertSame($manualDept->id, $ticket->department_id);
        $this->assertStringContainsString('503 Service Unavailable', (string) $ticket->error_reason);

        $this->assertDatabaseHas('ticket_status_histories', [
            'ticket_id' => $ticket->id,
            'from_status' => TicketStatus::Processing->value,
            'to_status' => TicketStatus::FallbackManual->value,
        ]);
    }
}
