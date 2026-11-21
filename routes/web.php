<?php

use App\Http\Controllers\ApiTokenController;
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

    Route::get('settings/api-tokens', [ApiTokenController::class, 'index'])->name('api-tokens.index');
    Route::post('settings/api-tokens', [ApiTokenController::class, 'store'])->name('api-tokens.store');
    Route::delete('settings/api-tokens/{tokenId}', [ApiTokenController::class, 'destroy'])->name('api-tokens.destroy');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
