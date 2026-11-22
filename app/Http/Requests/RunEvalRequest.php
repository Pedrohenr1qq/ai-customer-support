<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RunEvalRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, array<int, string>>
     */
    public function rules(): array
    {
        return [
            'case_ids' => ['nullable', 'array', 'min:1'],
            'case_ids.*' => ['integer', 'exists:eval_cases,id'],
        ];
    }
}
