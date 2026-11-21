<?php

namespace App\Models;

use App\Enums\TicketPriority;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TicketReview extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'ticket_id',
        'reviewer_user_id',
        'final_department_id',
        'final_priority',
        'final_reply',
        'ai_was_edited',
        'reviewed_at',
    ];

    protected function casts(): array
    {
        return [
            'final_priority' => TicketPriority::class,
            'ai_was_edited' => 'boolean',
            'reviewed_at' => 'datetime',
        ];
    }

    public function ticket(): BelongsTo
    {
        return $this->belongsTo(Ticket::class);
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewer_user_id');
    }

    public function finalDepartment(): BelongsTo
    {
        return $this->belongsTo(Department::class, 'final_department_id');
    }
}
