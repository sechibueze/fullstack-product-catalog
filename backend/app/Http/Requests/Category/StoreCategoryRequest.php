<?php

namespace App\Http\Requests\Category;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreCategoryRequest extends FormRequest
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
            'name'        => ['required', 'string', 'min:2', 'max:100'],
            'slug'        => ['nullable', 'string', 'max:120', Rule::unique('categories', 'slug')->whereNull('deleted_at')],
            'description' => ['nullable', 'string', 'max:1000'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Category name is required.',
            'name.min'      => 'Category name must be at least 2 characters.',
            'name.max'      => 'Category name cannot exceed 100 characters.',
            'slug.unique'   => 'This slug is already taken. Please choose another.',
            'slug.max'      => 'Slug cannot exceed 120 characters.',
        ];
    }
}
