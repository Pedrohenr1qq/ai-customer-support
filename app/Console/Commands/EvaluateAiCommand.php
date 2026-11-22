<?php

namespace App\Console\Commands;

use App\Services\EvalRunnerService;
use Illuminate\Console\Command;

class EvaluateAiCommand extends Command
{
    protected $signature = 'ai:evaluate {--cases=* : Specific eval_case IDs to evaluate}';

    protected $description = 'Run the AI classification evaluation suite against labeled eval_cases.';

    public function handle(EvalRunnerService $runner): int
    {
        $this->info('Running AI classification evaluation suite...');

        $caseIds = array_values(array_filter(
            array_map('intval', (array) $this->option('cases')),
            fn (int $id) => $id > 0,
        ));

        $run = $runner->run($caseIds === [] ? null : $caseIds);

        $this->table(
            ['Metric', 'Value'],
            [
                ['Provider / Model', "{$run->provider} / {$run->model_name}"],
                ['Total Cases', $run->total_cases],
                ['Category Accuracy', "{$run->category_accuracy}%"],
                ['Priority Accuracy', "{$run->priority_accuracy}%"],
                ['Valid Schema Rate', "{$run->valid_schema_rate}%"],
                ['Average Latency', "{$run->avg_latency_ms} ms"],
            ],
        );

        $this->info("Evaluation run #{$run->id} saved.");

        return self::SUCCESS;
    }
}
