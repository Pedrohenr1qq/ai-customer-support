<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EvalRun extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'provider',
        'model_name',
        'total_cases',
        'category_accuracy',
        'priority_accuracy',
        'valid_schema_rate',
        'avg_latency_ms',
        'results_json',
        'created_at',
    ];

    protected function casts(): array
    {
        return [
            'total_cases' => 'integer',
            'category_accuracy' => 'float',
            'priority_accuracy' => 'float',
            'valid_schema_rate' => 'float',
            'avg_latency_ms' => 'integer',
            'results_json' => 'array',
            'created_at' => 'datetime',
        ];
    }
}
