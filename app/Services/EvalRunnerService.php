<?php

namespace App\Services;

use App\Ai\Agents\TicketTriageAgent;
use App\Enums\TicketCategory;
use App\Enums\TicketPriority;
use App\Models\EvalCase;
use App\Models\EvalRun;
use Throwable;

class EvalRunnerService
{
    public function run(): EvalRun
    {
        $cases = EvalCase::orderBy('id')->get();
        $total = $cases->count();

        if ($total === 0) {
            return EvalRun::create([
                'provider' => config('ai.default', 'gemini'),
                'model_name' => 'gemini-2.0-flash',
                'total_cases' => 0,
                'category_accuracy' => 0,
                'priority_accuracy' => 0,
                'valid_schema_rate' => 0,
                'avg_latency_ms' => 0,
                'results_json' => [],
            ]);
        }

        $categoryMatches = 0;
        $priorityMatches = 0;
        $validSchemas = 0;
        $totalLatency = 0;
        $results = [];
        $provider = config('ai.default', 'gemini');
        $modelName = 'gemini-2.0-flash';

        $validCategories = array_column(TicketCategory::cases(), 'value');
        $validPriorities = array_column(TicketPriority::cases(), 'value');

        foreach ($cases as $case) {
            $startedAt = hrtime(true);

            try {
                $response = TicketTriageAgent::make()->prompt($case->message);
                $latencyMs = (int) round((hrtime(true) - $startedAt) / 1_000_000);
                $totalLatency += $latencyMs;

                $provider = $response->meta->provider ?? $provider;
                $modelName = $response->meta->model ?? $modelName;

                $structured = $response->structured;
                $predictedCategory = $structured['category'] ?? null;
                $predictedPriority = $structured['priority'] ?? null;

                $isSchemaValid = in_array($predictedCategory, $validCategories, true)
                    && in_array($predictedPriority, $validPriorities, true)
                    && ! empty($structured['suggested_reply']);

                if ($isSchemaValid) {
                    $validSchemas++;
                }

                $categoryMatch = $predictedCategory === $case->expected_category;
                $priorityMatch = $predictedPriority === $case->expected_priority;

                if ($categoryMatch) {
                    $categoryMatches++;
                }
                if ($priorityMatch) {
                    $priorityMatches++;
                }

                $results[] = [
                    'eval_case_id' => $case->id,
                    'title' => $case->title,
                    'expected_category' => $case->expected_category,
                    'predicted_category' => $predictedCategory,
                    'category_match' => $categoryMatch,
                    'expected_priority' => $case->expected_priority,
                    'predicted_priority' => $predictedPriority,
                    'priority_match' => $priorityMatch,
                    'schema_valid' => $isSchemaValid,
                    'confidence' => $structured['confidence'] ?? null,
                    'latency_ms' => $latencyMs,
                    'error' => null,
                ];
            } catch (Throwable $e) {
                $latencyMs = (int) round((hrtime(true) - $startedAt) / 1_000_000);
                $totalLatency += $latencyMs;

                $results[] = [
                    'eval_case_id' => $case->id,
                    'title' => $case->title,
                    'expected_category' => $case->expected_category,
                    'predicted_category' => null,
                    'category_match' => false,
                    'expected_priority' => $case->expected_priority,
                    'predicted_priority' => null,
                    'priority_match' => false,
                    'schema_valid' => false,
                    'confidence' => null,
                    'latency_ms' => $latencyMs,
                    'error' => $e->getMessage(),
                ];
            }
        }

        return EvalRun::create([
            'provider' => $provider,
            'model_name' => $modelName,
            'total_cases' => $total,
            'category_accuracy' => round(($categoryMatches / $total) * 100, 2),
            'priority_accuracy' => round(($priorityMatches / $total) * 100, 2),
            'valid_schema_rate' => round(($validSchemas / $total) * 100, 2),
            'avg_latency_ms' => (int) round($totalLatency / $total),
            'results_json' => $results,
        ]);
    }
}
