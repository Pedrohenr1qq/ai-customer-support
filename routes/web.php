<?php

use App\Http\Controllers\AiAgentController;
use App\Http\Controllers\EvalCaseController;
use App\Http\Controllers\EvalController;
use App\Http\Controllers\TicketDashboardController;
use App\Http\Controllers\TicketReviewController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', [TicketDashboardController::class, 'index'])->name('dashboard');
    Route::get('tickets/{ticket}', [TicketDashboardController::class, 'show'])->name('tickets.show');
    Route::post('tickets/{ticket}/review', [TicketReviewController::class, 'store'])->name('tickets.review');

    Route::get('evals', [EvalController::class, 'index'])->name('evals.index');
    Route::post('evals/run', [EvalController::class, 'store'])->name('evals.run');
    Route::get('evals/{evalRun}', [EvalController::class, 'show'])->name('evals.show');
    Route::post('eval-cases', [EvalCaseController::class, 'store'])->name('eval-cases.store');

    Route::get('ai-agents', [AiAgentController::class, 'index'])->name('ai-agents.index');
    Route::post('ai-agents', [AiAgentController::class, 'store'])->name('ai-agents.store');
    Route::patch('ai-agents/{aiAgent}', [AiAgentController::class, 'update'])->name('ai-agents.update');
    Route::post('ai-agents/{aiAgent}/prompts', [AiAgentController::class, 'storePrompt'])->name('ai-agents.prompts.store');
    Route::post('ai-agents/{aiAgent}/prompts/{prompt}/activate', [AiAgentController::class, 'activatePrompt'])->name('ai-agents.prompts.activate');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
