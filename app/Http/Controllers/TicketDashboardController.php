<?php

namespace App\Http\Controllers;

use App\Enums\TicketPriority;
use App\Enums\TicketStatus;
use App\Models\Department;
use App\Models\Ticket;
use App\Models\TicketReview;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TicketDashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $status = $request->string('status')->toString();
        $departmentId = $request->integer('department_id') ?: null;

        $tickets = Ticket::query()
            ->with(['department:id,slug,name', 'latestClassification'])
            ->when($status !== '', fn ($q) => $q->where('current_status', $status))
            ->when($departmentId !== null, fn ($q) => $q->where('department_id', $departmentId))
            ->orderByDesc('id')
            ->paginate(15)
            ->withQueryString();

        $totalReviews = TicketReview::count();
        $uneditedReviews = TicketReview::where('ai_was_edited', false)->count();

        $metrics = [
            'total' => Ticket::count(),
            'queued' => Ticket::whereIn('current_status', [TicketStatus::Queued->value, TicketStatus::Processing->value])->count(),
            'awaiting_review' => Ticket::where('current_status', TicketStatus::AwaitingReview->value)->count(),
            'fallback_manual' => Ticket::where('current_status', TicketStatus::FallbackManual->value)->count(),
            'resolved' => Ticket::whereIn('current_status', [
                TicketStatus::Resolved->value,
                TicketStatus::ResponseSent->value,
            ])->count(),
            'ai_acceptance_rate' => $totalReviews > 0 ? round(($uneditedReviews / $totalReviews) * 100, 1) : null,
        ];

        return Inertia::render('tickets/index', [
            'tickets' => $tickets,
            'departments' => Department::orderBy('name')->get(['id', 'slug', 'name']),
            'statuses' => array_map(
                fn (TicketStatus $s) => ['value' => $s->value, 'label' => $s->label()],
                TicketStatus::cases(),
            ),
            'metrics' => $metrics,
            'filters' => [
                'status' => $status,
                'department_id' => $departmentId,
            ],
        ]);
    }

    public function show(Ticket $ticket): Response
    {
        $ticket->load([
            'department:id,slug,name',
            'latestClassification',
            'review.reviewer:id,name,email',
            'review.finalDepartment:id,slug,name',
            'statusHistories.changedByUser:id,name',
        ]);

        return Inertia::render('tickets/show', [
            'ticket' => $ticket,
            'departments' => Department::orderBy('name')->get(['id', 'slug', 'name']),
            'priorities' => array_column(TicketPriority::cases(), 'value'),
        ]);
    }
}
