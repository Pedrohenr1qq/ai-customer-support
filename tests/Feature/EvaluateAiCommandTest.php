<?php

namespace Tests\Feature;

use App\Ai\Agents\TicketTriageAgent;
use App\Models\EvalCase;
use App\Models\EvalRun;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EvaluateAiCommandTest extends TestCase
{
    use RefreshDatabase;

    public function test_ai_evaluate_command_runs_and_persists_metrics(): void
    {
        EvalCase::create([
            'title' => 'Refund request',
            'message' => 'Please refund my duplicate charge.',
            'expected_category' => 'billing',
            'expected_priority' => 'high',
            'expected_department_slug' => 'billing',
        ]);

        TicketTriageAgent::fake([[
            'category' => 'billing',
            'priority' => 'high',
            'subject' => 'Duplicate charge refund',
            'confidence' => 0.95,
            'suggested_reply' => 'We have processed your refund.',
        ]]);

        $this->artisan('ai:evaluate')
            ->assertSuccessful();

        $run = EvalRun::firstOrFail();

        $this->assertSame(1, $run->total_cases);
        $this->assertEquals(100.0, $run->category_accuracy);
        $this->assertEquals(100.0, $run->priority_accuracy);
        $this->assertEquals(100.0, $run->valid_schema_rate);
        $this->assertSame('We have processed your refund.', $run->results_json[0]['suggested_reply']);
    }

    public function test_web_eval_run_can_filter_selected_cases_and_render_show_page(): void
    {
        $user = User::factory()->create();

        $caseA = EvalCase::create([
            'title' => 'Case A',
            'message' => 'Invoice PDF needed.',
            'expected_category' => 'billing',
            'expected_priority' => 'low',
            'expected_department_slug' => 'billing',
        ]);

        EvalCase::create([
            'title' => 'Case B',
            'message' => 'API 500 outage.',
            'expected_category' => 'technical_support',
            'expected_priority' => 'urgent',
            'expected_department_slug' => 'technical_support',
        ]);

        TicketTriageAgent::fake([[
            'category' => 'billing',
            'priority' => 'low',
            'subject' => 'Invoice PDF',
            'confidence' => 0.92,
            'suggested_reply' => 'Here is your invoice PDF.',
        ]]);

        $response = $this->actingAs($user)->post('/evals/run', [
            'case_ids' => [$caseA->id],
        ]);

        $run = EvalRun::firstOrFail();
        $response->assertRedirect("/evals/{$run->id}");

        $this->assertSame(1, $run->total_cases);
        $this->assertSame($caseA->id, $run->results_json[0]['eval_case_id']);

        $this->actingAs($user)
            ->get("/evals/{$run->id}")
            ->assertOk();
    }

    public function test_user_can_create_a_new_eval_case_from_web(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post('/eval-cases', [
            'title' => 'SSO login broken',
            'message' => 'Our SAML SSO login is throwing a 403 error for all team members.',
            'expected_category' => 'technical_support',
            'expected_priority' => 'urgent',
        ]);

        $evalCase = EvalCase::where('title', 'SSO login broken')->firstOrFail();

        $response->assertRedirect('/evals')
            ->assertSessionHas('created_case_id', $evalCase->id);

        $this->assertSame('technical_support', $evalCase->expected_department_slug);
    }
}
