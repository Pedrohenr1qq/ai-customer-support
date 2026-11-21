<?php

namespace App\Models;

use App\Enums\TicketCategory;
use App\Enums\TicketPriority;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AiClassification extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'ticket_id',
        'provider',
        'model_name',
        'category',
        'priority',
        'subject',
        'confidence',
        'suggested_reply',
        'raw_payload',
        'latency_ms',
        'created_at',
    ];

    protected function casts(): array
    {
        return [
            'category' => TicketCategory::class,
            'priority' => TicketPriority::class,
            'confidence' => 'float',
            'raw_payload' => 'array',
            'latency_ms' => 'integer',
            'created_at' => 'datetime',
        ];
    }

    public function ticket(): BelongsTo
    {
        return $this->belongsTo(Ticket::class);
    }
}
