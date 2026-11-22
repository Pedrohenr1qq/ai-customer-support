<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreAiAgentRequest extends FormRequest
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
            'provider' => ['required', 'string', 'max:50'],
            'model_name' => ['required', 'string', 'max:120'],
            'is_active' => ['sometimes', 'boolean'],
            'prompt_name' => ['nullable', 'string', 'max:120'],
            'instructions' => ['nullable', 'string', 'max:10000'],
        ];
    }
}
