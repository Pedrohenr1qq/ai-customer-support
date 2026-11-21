<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EvalCase extends Model
{
    protected $fillable = [
        'title',
        'message',
        'expected_category',
        'expected_priority',
        'expected_department_slug',
    ];
}
