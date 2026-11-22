<?php

namespace App\Http\Controllers;

use App\Enums\TicketStatus;
use App\Http\Requests\StoreTicketReviewRequest;
use App\Jobs\SendTicketResponseWebhookJob;
use App\Models\Ticket;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;

class TicketReviewController extends Controller
{
    public function store(StoreTicketReviewRequest $request, Ticket $ticket): RedirectResponse
    {
        $validated = $request->validated();
        $classification = $ticket->latestClassification;

        $aiWasEdited = true;
        if ($classification) {
            $aiWasEdited = (int) $validated['final_department_id'] !== (int) $ticket->department_id
                || $validated['final_priority'] !== $classification->priority->value
                || trim($validated['final_reply']) !== trim($classification->suggested_reply);
        }

        $review = DB::transaction(function () use ($request, $ticket, $validated, $aiWasEdited) {
            $review = $ticket->review()->create([
                'reviewer_user_id' => $request->user()->id,
                'final_department_id' => $validated['final_department_id'],
                'final_priority' => $validated['final_priority'],
                'final_reply' => $validated['final_reply'],
                'ai_was_edited' => $aiWasEdited,
                'reviewed_at' => now(),
            ]);

            $ticket->update([
                'department_id' => $validated['final_department_id'],
            ]);

            $ticket->transitionTo(
                TicketStatus::Resolved,
                'human',
                $request->user()->id,
                $aiWasEdited
                    ? 'Reviewed and edited by support agent before resolving.'
                    : 'AI classification and reply approved without edits.',
            );

            return $review;
        });

        SendTicketResponseWebhookJob::dispatch($ticket->fresh(), $review);

        return to_route('tickets.show', $ticket)->with('success', 'Ticket reviewed and resolved. Webhook dispatch queued.');
    }
}
