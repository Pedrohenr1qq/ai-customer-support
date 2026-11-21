<?php

namespace Tests\Feature;

use App\Ai\Agents\TicketTriageAgent;
use App\Models\EvalCase;
use App\Models\EvalRun;
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
    }
}
