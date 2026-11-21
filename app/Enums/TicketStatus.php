<?php

namespace App\Enums;

enum TicketStatus: string
{
    case Queued = 'queued';
    case Processing = 'processing';
    case AwaitingReview = 'awaiting_review';
    case FallbackManual = 'fallback_manual';
    case Resolved = 'resolved';

    public function label(): string
    {
        return match ($this) {
            self::Queued => 'Queued',
            self::Processing => 'Processing',
            self::AwaitingReview => 'Awaiting Review',
            self::FallbackManual => 'Manual Fallback',
            self::Resolved => 'Resolved',
        };
    }
}
