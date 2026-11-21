<?php

namespace App\Http\Requests;

use App\Enums\TicketPriority;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreTicketReviewRequest extends FormRequest
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
            'final_department_id' => ['required', 'integer', 'exists:departments,id'],
            'final_priority' => ['required', 'string', Rule::in(array_column(TicketPriority::cases(), 'value'))],
            'final_reply' => ['required', 'string', 'min:5', 'max:10000'],
        ];
    }
}
