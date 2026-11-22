<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreAiAgentPromptRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:120'],
            'instructions' => ['required', 'string', 'min:10', 'max:10000'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }
}
