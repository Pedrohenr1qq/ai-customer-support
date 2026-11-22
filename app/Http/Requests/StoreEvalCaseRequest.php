<?php

namespace App\Http\Requests;

use App\Enums\TicketCategory;
use App\Enums\TicketPriority;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreEvalCaseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:150'],
            'message' => ['required', 'string', 'min:10', 'max:5000'],
            'expected_category' => ['required', 'string', Rule::in(array_column(TicketCategory::cases(), 'value'))],
            'expected_priority' => ['required', 'string', Rule::in(array_column(TicketPriority::cases(), 'value'))],
        ];
    }
}
