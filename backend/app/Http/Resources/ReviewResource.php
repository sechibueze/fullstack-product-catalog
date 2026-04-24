<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReviewResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return  [
            'id'             => $this->id,
            'reviewer_name'  => $this->reviewer_name,
            'email'          => $this->email,
            'rating'         => $this->rating,
            'body'           => $this->body,
            'is_approved'    => $this->is_approved,
            'created_at'     => $this->created_at?->toIso8601String(),
            'product' => ProductResource::make(
                $this->whenLoaded('product')
            ),
        ];
    }
}
