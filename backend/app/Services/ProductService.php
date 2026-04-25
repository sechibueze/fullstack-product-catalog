<?php

namespace App\Services;

use App\Models\Product;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Str;

class ProductService
{
    public function list(array $filters = [], int $perPage = 12): LengthAwarePaginator
    {
        $query = Product::with('category')
            ->withCount('reviews');

        // Filter by category slug
        if (!empty($filters['category'])) {
            $query->whereHas('category', function ($q) use ($filters) {
                $q->where('slug', $filters['category']);
            });
        }

        // Filter published only for public access
        if (isset($filters['published_only']) && $filters['published_only']) {
            $query->published();
        }

        // Search by name
        if (!empty($filters['search'])) {
            $query->where('name', 'ilike', "%{$filters['search']}%");
        }

        return $query->orderBy('created_at', 'desc')->paginate($perPage);
    }

    public function findBySlug(string $slug): Product
    {
        return Product::with([
            'category',
            'reviews' => fn($q) => $q->approved()->orderBy('created_at', 'desc'),
        ])
        ->where('slug', $slug)
        ->firstOrFail();
    }

    public function findById(string $id): Product
    {
        return Product::with('category')->findOrFail($id);
    }

    public function create(array $data): Product
    {
        $data['slug'] = $data['slug'] ?? Str::slug($data['name']);
        return Product::create($data);
    }

    public function update(Product $product, array $data): Product
    {
        if (isset($data['name']) && !isset($data['slug'])) {
            $data['slug'] = Str::slug($data['name']);
        }
        $product->update($data);
        return $product->fresh(['category']);
    }

    public function delete(Product $product): void
    {
        $product->delete();
    }
}