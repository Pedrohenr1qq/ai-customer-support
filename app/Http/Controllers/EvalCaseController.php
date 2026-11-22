<?php

namespace App\Http\Controllers;

use App\Enums\TicketCategory;
use App\Http\Requests\StoreEvalCaseRequest;
use App\Models\EvalCase;
use Illuminate\Http\RedirectResponse;

class EvalCaseController extends Controller
{
    public function store(StoreEvalCaseRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $category = TicketCategory::from($validated['expected_category']);

        $evalCase = EvalCase::create([
            ...$validated,
            'expected_department_slug' => $category->departmentSlug(),
        ]);

        return to_route('evals.index')
            ->with('created_case_id', $evalCase->id);
    }
}
