<?php

namespace App\Models;

use App\Enums\TicketStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Facades\DB;

class Ticket extends Model
{
    use HasFactory;

    protected $fillable = [
        'external_id',
        'created_by_user_id',
        'customer_name',
        'customer_email',
        'subject_raw',
        'message',
        'current_status',
        'department_id',
        'error_reason',
    ];

    protected function casts(): array
    {
        return [
            'current_status' => TicketStatus::class,
        ];
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by_user_id');
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    public function statusHistories(): HasMany
    {
        return $this->hasMany(TicketStatusHistory::class)->orderByDesc('id');
    }

    public function latestClassification(): HasOne
    {
        return $this->hasOne(AiClassification::class)->latestOfMany();
    }

    public function classifications(): HasMany
    {
        return $this->hasMany(AiClassification::class);
    }

    public function review(): HasOne
    {
        return $this->hasOne(TicketReview::class)->latestOfMany();
    }

    /**
     * Transition ticket status atomically and append a lifecycle history record.
     */
    public function transitionTo(
        TicketStatus $to,
        string $changedByType,
        ?int $changedByUserId = null,
        ?string $notes = null,
    ): TicketStatusHistory {
        return DB::transaction(function () use ($to, $changedByType, $changedByUserId, $notes) {
            $from = $this->current_status?->value;

            $this->update(['current_status' => $to]);

            return $this->statusHistories()->create([
                'from_status' => $from,
                'to_status' => $to->value,
                'changed_by_type' => $changedByType,
                'changed_by_user_id' => $changedByUserId,
                'notes' => $notes,
            ]);
        });
    }
}
