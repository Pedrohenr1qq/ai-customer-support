<?php

namespace Tests\Feature;

use App\Enums\TicketStatus;
use App\Jobs\SendTicketResponseWebhookJob;
use App\Models\Department;
use App\Models\Ticket;
use App\Models\User;
use App\Services\WebhookDispatcherService;
use Database\Seeders\DepartmentSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Queue;
use Tests\TestCase;

class TicketReviewTest extends TestCase
{
    use RefreshDatabase;

    public function test_human_agent_can_review_resolve_and_queue_webhook_job(): void
    {
        $this->seed(DepartmentSeeder::class);
        Queue::fake();

        $user = User::factory()->create();
        $billingDept = Department::where('slug', 'billing')->firstOrFail();

        $ticket = Ticket::create([
            'customer_name' => 'Bob',
            'customer_email' => 'bob@example.com',
            'message' => 'Need my October invoice PDF.',
            'current_status' => TicketStatus::AwaitingReview,
            'department_id' => $billingDept->id,
        ]);

        $ticket->classifications()->create([
            'provider' => 'gemini',
            'model_name' => 'gemini-flash-lite-latest',
            'category' => 'billing',
            'priority' => 'low',
            'subject' => 'Invoice PDF request',
            'confidence' => 0.91,
            'suggested_reply' => 'Here is your October invoice PDF.',
            'raw_payload' => ['category' => 'billing'],
            'latency_ms' => 210,
        ]);

        $response = $this->actingAs($user)->post("/tickets/{$ticket->id}/review", [
            'final_department_id' => $billingDept->id,
            'final_priority' => 'low',
            'final_reply' => 'Here is your October invoice PDF.',
        ]);

        $response->assertRedirect("/tickets/{$ticket->id}");

        $ticket->refresh();
        $this->assertSame(TicketStatus::Resolved, $ticket->current_status);

        $this->assertDatabaseHas('ticket_reviews', [
            'ticket_id' => $ticket->id,
            'reviewer_user_id' => $user->id,
            'ai_was_edited' => false,
        ]);

        $this->assertDatabaseHas('ticket_status_histories', [
            'ticket_id' => $ticket->id,
            'from_status' => TicketStatus::AwaitingReview->value,
            'to_status' => TicketStatus::Resolved->value,
            'changed_by_type' => 'human',
        ]);

        Queue::assertPushed(SendTicketResponseWebhookJob::class, function (SendTicketResponseWebhookJob $job) use ($ticket) {
            return $job->ticket->id === $ticket->id && $job->tries === 3;
        });
    }

    public function test_webhook_job_sends_signed_http_request_and_transitions_to_response_sent(): void
    {
        $this->seed(DepartmentSeeder::class);

        Http::fake([
            'https://partner.example.test/webhook' => Http::response(['ok' => true], 202),
        ]);

        Config::set('services.support_webhook.url', 'https://partner.example.test/webhook');
        Config::set('services.support_webhook.secret', 'super-secret');

        $user = User::factory()->create();
        $billingDept = Department::where('slug', 'billing')->firstOrFail();

        $ticket = Ticket::create([
            'external_id' => 'EXT-555',
            'customer_name' => 'Ana',
            'customer_email' => 'ana@example.com',
            'message' => 'Invoice question.',
            'current_status' => TicketStatus::Resolved,
            'department_id' => $billingDept->id,
        ]);

        $review = $ticket->review()->create([
            'reviewer_user_id' => $user->id,
            'final_department_id' => $billingDept->id,
            'final_priority' => 'medium',
            'final_reply' => 'Your invoice has been sent.',
            'ai_was_edited' => false,
            'reviewed_at' => now(),
        ]);

        (new SendTicketResponseWebhookJob($ticket, $review))->handle(app(WebhookDispatcherService::class));

        Http::assertSent(function ($request) use ($ticket) {
            return $request->url() === 'https://partner.example.test/webhook'
                && $request->hasHeader('X-Webhook-Signature')
                && $request['ticket_id'] === $ticket->id
                && $request['external_id'] === 'EXT-555'
                && $request['final_reply'] === 'Your invoice has been sent.';
        });

        $this->assertSame(TicketStatus::ResponseSent, $ticket->fresh()->current_status);

        $this->assertDatabaseHas('ticket_status_histories', [
            'ticket_id' => $ticket->id,
            'from_status' => TicketStatus::Resolved->value,
            'to_status' => TicketStatus::ResponseSent->value,
            'changed_by_type' => 'system',
        ]);
    }
}
