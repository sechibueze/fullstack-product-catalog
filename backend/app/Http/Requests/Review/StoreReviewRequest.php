<?php

namespace App\Http\Requests\Review;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreReviewRequest extends FormRequest
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
            'reviewer_name' => ['required', 'string', 'min:2', 'max:100'],
            'email'         => ['required', 'email', 'max:254'],
            'rating'        => ['required', 'integer', 'min:1', 'max:5'],
            'body'          => ['required', 'string', 'min:10', 'max:2000'],
        ];
    }

    public function messages(): array
    {
        return [
            'reviewer_name.required' => 'Your name is required.',
            'reviewer_name.min'      => 'Name must be at least 2 characters.',
            'reviewer_name.max'      => 'Name cannot exceed 100 characters.',
            'email.required'         => 'Email address is required.',
            'email.email'            => 'Please provide a valid email address.',
            'rating.required'        => 'Please provide a rating.',
            'rating.integer'         => 'Rating must be a whole number.',
            'rating.min'             => 'Rating must be at least 1.',
            'rating.max'             => 'Rating cannot exceed 5.',
            'body.required'          => 'Review body is required.',
            'body.min'               => 'Review must be at least 10 characters.',
            'body.max'               => 'Review cannot exceed 2000 characters.',
        ];
    }
}
