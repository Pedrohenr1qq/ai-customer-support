<?php

namespace App\Enums;

enum TicketCategory: string
{
    case TechnicalSupport = 'technical_support';
    case Billing = 'billing';
    case Sales = 'sales';
    case Cancellation = 'cancellation';
    case Other = 'other';

    public function departmentSlug(): string
    {
        return match ($this) {
            self::TechnicalSupport => 'technical_support',
            self::Billing => 'billing',
            self::Sales => 'sales',
            self::Cancellation => 'cancellation',
            self::Other => 'manual_triage',
        };
    }
}
