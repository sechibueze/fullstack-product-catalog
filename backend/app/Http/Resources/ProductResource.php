<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'           => $this->id,
            'name'         => $this->name,
            'slug'         => $this->slug,
            'description'  => $this->description,
            'price'        => (float) $this->price,
            'stock_qty'    => $this->stock_qty,
            'is_published' => $this->is_published,
            'created_at'   => $this->created_at?->toIso8601String(),
            'updated_at'   => $this->updated_at?->toIso8601String(),

            'category' => CategoryResource::make(
                $this->whenLoaded('category')
            ),
            'reviews' => ReviewCollection::make(
                $this->whenLoaded('reviews')
            ),
            'reviews_count'          => $this->whenCounted('reviews'),
            'approved_reviews_count' => $this->when(
                $this->relationLoaded('reviews'),
                fn() => $this->reviews->where('is_approved', true)->count()
            ),

            // Average rating from approved reviews
            'average_rating' => $this->when(
                $this->relationLoaded('reviews'),
                fn() => $this->reviews->where('is_approved', true)->avg('rating')
                    ? round($this->reviews->where('is_approved', true)->avg('rating'), 1)
                    : null
            ),
        ];
    }
}
