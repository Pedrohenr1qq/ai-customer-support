<?php

namespace Tests\Feature;

use App\Enums\TicketStatus;
use App\Models\Department;
use App\Models\Ticket;
use App\Models\User;
use Database\Seeders\DepartmentSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TicketReviewTest extends TestCase
{
    use RefreshDatabase;

    public function test_human_agent_can_review_and_resolve_ticket(): void
    {
        $this->seed(DepartmentSeeder::class);

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
            'model_name' => 'gemini-2.0-flash',
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
    }
}
