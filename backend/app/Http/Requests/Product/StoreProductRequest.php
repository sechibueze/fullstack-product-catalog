<?php

namespace App\Http\Requests\Product;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreProductRequest extends FormRequest
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
            'category_id'  => ['required', 'uuid', Rule::exists('categories', 'id')->whereNull('deleted_at')],
            'name'         => ['required', 'string', 'min:2', 'max:200'],
            'slug'         => ['nullable', 'string', 'max:220', Rule::unique('products', 'slug')->whereNull('deleted_at')],
            'description'  => ['nullable', 'string', 'max:5000'],
            'price'        => ['required', 'numeric', 'min:0', 'max:999999.99'],
            'stock_qty'    => ['required', 'integer', 'min:0', 'max:999999'],
            'is_published' => ['sometimes', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'category_id.required' => 'Please select a category.',
            'category_id.uuid'     => 'Invalid category ID format.',
            'category_id.exists'   => 'The selected category does not exist.',
            'name.required'        => 'Product name is required.',
            'name.min'             => 'Product name must be at least 2 characters.',
            'name.max'             => 'Product name cannot exceed 200 characters.',
            'slug.unique'          => 'This slug is already taken. Please choose another.',
            'price.required'       => 'Product price is required.',
            'price.numeric'        => 'Price must be a valid number.',
            'price.min'            => 'Price cannot be negative.',
            'price.max'            => 'Price cannot exceed 999,999.99.',
            'stock_qty.required'   => 'Stock quantity is required.',
            'stock_qty.integer'    => 'Stock quantity must be a whole number.',
            'stock_qty.min'        => 'Stock quantity cannot be negative.',
        ];
    }
}
