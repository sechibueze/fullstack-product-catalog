<?php

namespace App\Http\Requests\Review;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateReviewRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'is_approved'   => ['sometimes', 'boolean'],
            'reviewer_name' => ['sometimes', 'string', 'min:2', 'max:100'],
            'email'         => ['sometimes', 'email', 'max:254'],
            'rating'        => ['sometimes', 'integer', 'min:1', 'max:5'],
            'body'          => ['sometimes', 'string', 'min:10', 'max:2000'],
        ];
    }

    public function messages(): array
    {
        return [
            'reviewer_name.min' => 'Name must be at least 2 characters.',
            'email.email'       => 'Please provide a valid email address.',
            'rating.min'        => 'Rating must be at least 1.',
            'rating.max'        => 'Rating cannot exceed 5.',
            'body.min'          => 'Review must be at least 10 characters.',
            'body.max'          => 'Review cannot exceed 2000 characters.',
        ];
    }
}
