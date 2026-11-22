<?php

namespace Tests\Feature;

use App\Ai\Agents\TicketTriageAgent;
use App\Enums\TicketStatus;
use App\Jobs\ClassifyTicketJob;
use App\Models\AiAgent;
use App\Models\Ticket;
use App\Models\User;
use Database\Seeders\DepartmentSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AiAgentConfigurationTest extends TestCase
{
    use RefreshDatabase;

    public function test_ticket_triage_agent_uses_custom_prompt_and_falls_back_to_default(): void
    {
        $fallbackAgent = new TicketTriageAgent();
        $this->assertSame(TicketTriageAgent::defaultInstructions(), $fallbackAgent->instructions());

        $agentModel = AiAgent::create([
            'name' => 'Custom Agent',
            'provider' => 'gemini',
            'model_name' => 'gemini-flash-latest',
            'is_active' => true,
        ]);

        $agentWithoutPrompt = new TicketTriageAgent($agentModel->load('activePrompt'));
        $this->assertSame(TicketTriageAgent::defaultInstructions(), $agentWithoutPrompt->instructions());

        $agentModel->prompts()->create([
            'name' => 'Strict Billing Prompt',
            'instructions' => 'Always prioritize billing issues as urgent.',
            'is_active' => true,
        ]);

        $configuredAgent = new TicketTriageAgent(AiAgent::active());
        $this->assertSame('Always prioritize billing issues as urgent.', $configuredAgent->instructions());
    }

    public function test_classify_ticket_job_uses_active_agent_configuration(): void
    {
        $this->seed(DepartmentSeeder::class);

        $agent = AiAgent::create([
            'name' => 'Configured Agent',
            'provider' => 'gemini',
            'model_name' => 'gemini-3.5-flash',
            'is_active' => true,
        ]);

        $agent->prompts()->create([
            'name' => 'Custom v1',
            'instructions' => 'Custom instructions for support triage.',
            'is_active' => true,
        ]);

        TicketTriageAgent::fake([[
            'category' => 'technical_support',
            'priority' => 'high',
            'subject' => 'Webhook failing',
            'confidence' => 0.93,
            'suggested_reply' => 'We are investigating your webhook.',
        ]]);

        $ticket = Ticket::create([
            'customer_name' => 'Lucas',
            'customer_email' => 'lucas@example.com',
            'message' => 'Webhooks are returning 500.',
            'current_status' => TicketStatus::Queued,
        ]);

        (new ClassifyTicketJob($ticket))->handle();

        $this->assertSame(TicketStatus::AwaitingReview, $ticket->fresh()->current_status);
        $this->assertDatabaseHas('ai_classifications', [
            'ticket_id' => $ticket->id,
            'category' => 'technical_support',
        ]);
    }

    public function test_authenticated_user_can_manage_ai_agents_and_prompts(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)->post('/ai-agents', [
            'name' => 'Pro Triage Agent',
            'provider' => 'gemini',
            'model_name' => 'gemini-flash-latest',
            'is_active' => true,
            'prompt_name' => 'v1',
            'instructions' => 'Classify customer tickets carefully and concisely.',
        ])->assertRedirect('/ai-agents');

        $agent = AiAgent::where('name', 'Pro Triage Agent')->firstOrFail();
        $this->assertTrue($agent->is_active);
        $this->assertSame('v1', $agent->activePrompt->name);

        $this->actingAs($user)->post("/ai-agents/{$agent->id}/prompts", [
            'name' => 'v2',
            'instructions' => 'Updated instructions with stricter priority rules.',
            'is_active' => true,
        ])->assertRedirect('/ai-agents');

        $this->assertSame('v2', $agent->fresh()->activePrompt->name);

        $this->actingAs($user)->patch("/ai-agents/{$agent->id}", [
            'name' => 'Pro Triage Agent',
            'provider' => 'gemini',
            'model_name' => 'gemini-4-hydrogen',
            'is_active' => true,
        ])->assertRedirect('/ai-agents');

        $this->assertSame('gemini-4-hydrogen', $agent->fresh()->model_name);
    }
}
