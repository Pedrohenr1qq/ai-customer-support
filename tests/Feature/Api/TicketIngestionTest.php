<?php

namespace Tests\Feature\Api;

use App\Enums\TicketStatus;
use App\Jobs\ClassifyTicketJob;
use App\Models\Ticket;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Queue;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class TicketIngestionTest extends TestCase
{
    use RefreshDatabase;

    public function test_unauthenticated_request_is_rejected(): void
    {
        $response = $this->postJson('/api/tickets', [
            'customer_name' => 'Jane Doe',
            'customer_email' => 'jane@example.com',
            'message' => 'I need help with my billing invoice.',
        ]);

        $response->assertUnauthorized();
    }

    public function test_validation_errors_are_returned_for_invalid_payload(): void
    {
        Sanctum::actingAs(User::factory()->create());

        $response = $this->postJson('/api/tickets', [
            'customer_name' => '',
            'customer_email' => 'not-an-email',
            'message' => 'short',
        ]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['customer_name', 'customer_email', 'message']);
    }

    public function test_authorized_client_can_ingest_ticket_and_dispatch_job(): void
    {
        Queue::fake();

        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $response = $this->postJson('/api/tickets', [
            'external_id' => 'EXT-9001',
            'customer_name' => 'Jane Doe',
            'customer_email' => 'jane@example.com',
            'subject_raw' => 'Double charge',
            'message' => 'I was charged twice on my credit card this morning.',
        ]);

        $response->assertAccepted()
            ->assertJson([
                'external_id' => 'EXT-9001',
                'status' => TicketStatus::Queued->value,
            ]);

        $ticket = Ticket::firstOrFail();

        $this->assertDatabaseHas('ticket_status_histories', [
            'ticket_id' => $ticket->id,
            'from_status' => null,
            'to_status' => TicketStatus::Queued->value,
            'changed_by_type' => 'api',
            'changed_by_user_id' => $user->id,
        ]);

        Queue::assertPushed(ClassifyTicketJob::class, function (ClassifyTicketJob $job) use ($ticket) {
            return $job->ticket->id === $ticket->id && $job->tries === 3;
        });
    }
}
