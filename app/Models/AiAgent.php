<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class AiAgent extends Model
{
    protected $fillable = [
        'name',
        'provider',
        'model_name',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    public function prompts(): HasMany
    {
        return $this->hasMany(AiAgentPrompt::class)->orderByDesc('id');
    }

    public function activePrompt(): HasOne
    {
        return $this->hasOne(AiAgentPrompt::class)->where('is_active', true);
    }

    public static function active(): ?self
    {
        return self::with('activePrompt')->where('is_active', true)->first();
    }
}
