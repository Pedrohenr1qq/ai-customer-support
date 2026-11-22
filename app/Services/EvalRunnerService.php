<?php

namespace App\Services;

use App\Ai\Agents\TicketTriageAgent;
use App\Enums\TicketCategory;
use App\Enums\TicketPriority;
use App\Models\AiAgent;
use App\Models\EvalCase;
use App\Models\EvalRun;
use Laravel\Ai\Exceptions\FailoverableException;
use Laravel\Ai\Responses\StructuredAgentResponse;
use Throwable;

class EvalRunnerService
{
    /**
     * @param  array<int, int>|null  $caseIds
     */
    public function run(?array $caseIds = null): EvalRun
    {
        $cases = EvalCase::query()
            ->when($caseIds !== null && $caseIds !== [], fn ($q) => $q->whereIn('id', $caseIds))
            ->orderBy('id')
            ->get();

        $total = $cases->count();

        if ($total === 0) {
            return EvalRun::create([
                'provider' => config('ai.default', 'gemini'),
                'model_name' => config('ai.providers.gemini.models.text.default', 'gemini-flash-lite-latest'),
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
        $agentConfig = AiAgent::active();
        $provider = $agentConfig?->provider ?? config('ai.default', 'gemini');
        $modelName = $agentConfig?->model_name ?? config('ai.providers.gemini.models.text.default', 'gemini-flash-lite-latest');

        $validCategories = array_column(TicketCategory::cases(), 'value');
        $validPriorities = array_column(TicketPriority::cases(), 'value');

        foreach ($cases as $case) {
            $startedAt = hrtime(true);

            try {
                $response = $this->promptWithRetry($case->message, $agentConfig);
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
                    'message' => $case->message,
                    'expected_category' => $case->expected_category,
                    'predicted_category' => $predictedCategory,
                    'category_match' => $categoryMatch,
                    'expected_priority' => $case->expected_priority,
                    'predicted_priority' => $predictedPriority,
                    'priority_match' => $priorityMatch,
                    'predicted_subject' => $structured['subject'] ?? null,
                    'suggested_reply' => $structured['suggested_reply'] ?? null,
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
                    'message' => $case->message,
                    'expected_category' => $case->expected_category,
                    'predicted_category' => null,
                    'category_match' => false,
                    'expected_priority' => $case->expected_priority,
                    'predicted_priority' => null,
                    'priority_match' => false,
                    'predicted_subject' => null,
                    'suggested_reply' => null,
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

    private function promptWithRetry(string $message, ?AiAgent $agentConfig, int $maxAttempts = 3): StructuredAgentResponse
    {
        $agent = new TicketTriageAgent($agentConfig);

        for ($attempt = 1; $attempt <= $maxAttempts; $attempt++) {
            try {
                return $agent->prompt(
                    $message,
                    provider: $agentConfig?->provider,
                    model: $agentConfig?->model_name,
                );
            } catch (FailoverableException $e) {
                if ($attempt === $maxAttempts) {
                    throw $e;
                }

                sleep($attempt * 2);
            }
        }

        throw new \RuntimeException('Unreachable retry state.');
    }
}
