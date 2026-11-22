<?php

namespace App\Jobs;

use App\Models\Ticket;
use App\Models\TicketReview;
use App\Services\WebhookDispatcherService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class SendTicketResponseWebhookJob implements ShouldQueue
{
    use Queueable;

    public int $tries = 3;

    public function __construct(
        public readonly Ticket $ticket,
        public readonly TicketReview $review,
    ) {}

    /**
     * Exponential backoff (in seconds) between webhook delivery retries.
     *
     * @return array<int, int>
     */
    public function backoff(): array
    {
        return [10, 30, 60];
    }

    public function handle(WebhookDispatcherService $webhookDispatcher): void
    {
        $ticket = $this->ticket->fresh();
        $review = $this->review->fresh();

        if (! $ticket || ! $review) {
            return;
        }

        $webhookDispatcher->sendTicketResponse($ticket, $review);
    }
}
