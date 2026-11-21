<?php

namespace App\Http\Controllers;

use App\Models\EvalCase;
use App\Models\EvalRun;
use App\Services\EvalRunnerService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class EvalController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('evals/index', [
            'runs' => EvalRun::orderByDesc('id')->limit(10)->get(),
            'cases' => EvalCase::orderBy('id')->get(),
        ]);
    }

    public function store(EvalRunnerService $runner): RedirectResponse
    {
        $run = $runner->run();

        return to_route('evals.index')->with('success', "Evaluation run #{$run->id} completed.");
    }
}
