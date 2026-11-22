<?php

namespace App\Http\Controllers;

use App\Enums\TicketCategory;
use App\Enums\TicketPriority;
use App\Http\Requests\RunEvalRequest;
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
            'categories' => array_column(TicketCategory::cases(), 'value'),
            'priorities' => array_column(TicketPriority::cases(), 'value'),
            'createdCaseId' => session('created_case_id'),
        ]);
    }

    public function show(EvalRun $evalRun): Response
    {
        return Inertia::render('evals/show', [
            'run' => $evalRun,
        ]);
    }

    public function store(RunEvalRequest $request, EvalRunnerService $runner): RedirectResponse
    {
        $run = $runner->run($request->validated('case_ids'));

        return to_route('evals.show', $run)->with('success', "Evaluation run #{$run->id} completed.");
    }
}
