<?php

namespace App\Services;

use App\Models\Product;
use App\Models\Review;
use Illuminate\Pagination\LengthAwarePaginator;

class ReviewService
{
    public function list(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = Review::with('product');

        if (isset($filters['is_approved'])) {
            $query->where('is_approved', $filters['is_approved']);
        }

        if (!empty($filters['product_id'])) {
            $query->where('product_id', $filters['product_id']);
        }

        return $query->orderBy('created_at', 'desc')->paginate($perPage);
    }

    public function findById(string $id): Review
    {
        return Review::with('product')->findOrFail($id);
    }

    public function createForProduct(Product $product, array $data): Review
    {
        return $product->reviews()->create($data);
    }

    public function update(Review $review, array $data): Review
    {
        $review->update($data);
        return $review->fresh();
    }

    public function delete(Review $review): void
    {
        $review->delete();
    }

    public function approve(Review $review): Review
    {
        $review->update(['is_approved' => true]);
        return $review->fresh();
    }

    public function reject(Review $review): Review
    {
        $review->update(['is_approved' => false]);
        return $review->fresh();
    }
}