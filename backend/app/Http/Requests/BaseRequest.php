<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

abstract class BaseRequest extends FormRequest
{
    protected function failedValidation(Validator $validator): never
    {
        throw new HttpResponseException(
            response()->json([
                'message' => 'The given data was invalid.',
                'errors'  => $validator->errors(),
            ], 422)
        );
    }

    protected function failedAuthorization(): never
    {
        throw new HttpResponseException(
            response()->json([
                'message' => 'You are not authorized to perform this action.',
                'errors'  => [],
            ], 403)
        );
    }
}