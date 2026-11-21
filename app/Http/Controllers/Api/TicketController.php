<?php

namespace App\Http\Controllers\Api;

use App\Enums\TicketStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\StoreTicketRequest;
use App\Jobs\ClassifyTicketJob;
use App\Models\Ticket;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class TicketController extends Controller
{
    public function store(StoreTicketRequest $request): JsonResponse
    {
        $ticket = DB::transaction(function () use ($request) {
            $ticket = Ticket::create([
                ...$request->validated(),
                'created_by_user_id' => $request->user()?->id,
                'current_status' => TicketStatus::Queued,
            ]);

            $ticket->statusHistories()->create([
                'from_status' => null,
                'to_status' => TicketStatus::Queued->value,
                'changed_by_type' => 'api',
                'changed_by_user_id' => $request->user()?->id,
                'notes' => 'Ticket ingested via Sanctum API.',
            ]);

            return $ticket;
        });

        ClassifyTicketJob::dispatch($ticket);

        return response()->json([
            'id' => $ticket->id,
            'external_id' => $ticket->external_id,
            'status' => $ticket->current_status->value,
            'message' => 'Ticket queued for AI classification.',
        ], 202);
    }

    public function show(Ticket $ticket): JsonResponse
    {
        $ticket->load(['department', 'latestClassification', 'statusHistories']);

        return response()->json([
            'id' => $ticket->id,
            'external_id' => $ticket->external_id,
            'status' => $ticket->current_status->value,
            'department' => $ticket->department?->only(['id', 'slug', 'name']),
            'classification' => $ticket->latestClassification,
            'status_histories' => $ticket->statusHistories,
        ]);
    }
}
