<?php

namespace App\Services;

use App\Enums\TicketStatus;
use App\Models\Ticket;
use App\Models\TicketReview;
use Illuminate\Support\Facades\Http;

class WebhookDispatcherService
{
    /**
     * Dispatch the approved response payload to the configured external webhook
     * and transition the ticket to ResponseSent when successful.
     *
     * @return array{dispatched: bool, status: int, url: string}
     */
    public function sendTicketResponse(Ticket $ticket, TicketReview $review): array
    {
        $enabled = (bool) config('services.support_webhook.enabled', true);
        $url = (string) config('services.support_webhook.url');
        $secret = (string) config('services.support_webhook.secret');
        $timeout = (int) config('services.support_webhook.timeout', 5);

        if (! $enabled || $url === '') {
            return [
                'dispatched' => false,
                'status' => 0,
                'url' => $url,
            ];
        }

        $review->loadMissing('finalDepartment');

        $payload = [
            'event' => 'ticket.response_ready',
            'ticket_id' => $ticket->id,
            'external_id' => $ticket->external_id,
            'customer_email' => $ticket->customer_email,
            'department' => $review->finalDepartment?->slug,
            'final_priority' => $review->final_priority->value,
            'final_reply' => $review->final_reply,
            'ai_was_edited' => $review->ai_was_edited,
            'resolved_at' => $review->reviewed_at?->toIso8601String(),
        ];

        $signature = hash_hmac('sha256', (string) json_encode($payload), $secret);

        $response = Http::timeout($timeout)
            ->withHeaders([
                'X-Webhook-Signature' => $signature,
            ])
            ->post($url, $payload)
            ->throw();

        $status = $response->status();

        $ticket->transitionTo(
            TicketStatus::ResponseSent,
            'system',
            notes: "Webhook delivered to {$url} (HTTP {$status}).",
        );

        return [
            'dispatched' => true,
            'status' => $status,
            'url' => $url,
        ];
    }
}
