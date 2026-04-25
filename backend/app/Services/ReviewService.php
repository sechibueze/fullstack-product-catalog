<?php

namespace App\Services;

use App\Models\Product;
use App\Models\Review;
use Illuminate\Pagination\LengthAwarePaginator;

class ReviewService
{
    public function list(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $page = request()->query('page', 1);
        $key  = CacheService::reviewListKey(
            $page,
            $perPage,
            $filters['product_id'] ?? null,
            $filters['is_approved'] ?? null
        );

        return CacheService::reviews()->remember(
            $key,
            CacheService::TTL_REVIEWS,
            function () use ($filters, $perPage) {
                $query = Review::with('product');

                if (isset($filters['is_approved'])) {
                    $query->where('is_approved', $filters['is_approved']);
                }

                if (!empty($filters['product_id'])) {
                    $query->where('product_id', $filters['product_id']);
                }

                return $query->orderBy('created_at', 'desc')->paginate($perPage);
            }
        );
    }

    public function findById(string $id): Review
    {
        return Review::with('product')->findOrFail($id);
    }

    public function createForProduct(Product $product, array $data): Review
    {
        $review = Review::create(array_merge($data, [
            'product_id'  => $product->id,
            'is_approved' => false,
        ]));
        CacheService::bustReviews();
        return $review;
    }

    public function update(Review $review, array $data): Review
    {
        $review->update($data);
        CacheService::bustReviews();
        return $review->fresh();
    }

    public function delete(Review $review): void
    {
        $review->delete();
        CacheService::bustReviews();
    }

    public function approve(Review $review): Review
    {
        $review->update(['is_approved' => true]);
        CacheService::bustReviews();

        // We need to also bust the product detail cache since avg rating changes
        CacheService::bustProductDetail($review->product->slug);

        return $review->fresh();
    }

    public function reject(Review $review): Review
    {
        $review->update(['is_approved' => false]);
        CacheService::bustReviews();
        CacheService::bustProductDetail($review->product->slug);

        return $review->fresh();
    }
}