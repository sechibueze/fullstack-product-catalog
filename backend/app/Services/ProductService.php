<?php

namespace App\Services;

use App\Models\Product;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Str;

class ProductService
{
    public function list(array $filters = [], int $perPage = 12): LengthAwarePaginator
    {
        $page = request()->query('page', 1);
        $key  = CacheService::productListKey(
            $page,
            $perPage,
            $filters['category']       ?? null,
            $filters['search']         ?? null,
            $filters['published_only'] ?? true
        );

        return CacheService::products()->remember(
            $key,
            CacheService::TTL_PRODUCTS,
            function () use ($filters, $perPage) {
                $query = Product::with('category')->withCount('reviews');

                if (!empty($filters['category'])) {
                    $query->whereHas('category', fn($q) =>
                        $q->where('slug', $filters['category'])
                    );
                }

                if (isset($filters['published_only']) && $filters['published_only']) {
                    $query->published();
                }

                if (!empty($filters['search'])) {
                    $query->where('name', 'ilike', '%' . $filters['search'] . '%');
                }

                return $query->orderBy('created_at', 'desc')->paginate($perPage);
            }
        );
    }

    public function findBySlug(string $slug): Product
    {
        $key = CacheService::productDetailKey($slug);

        return CacheService::products()->remember(
            $key,
            CacheService::TTL_PRODUCTS,
            fn() => Product::with([
                'category',
                'reviews' => fn($q) => $q->approved()->orderBy('created_at', 'desc'),
            ])
            ->where('slug', $slug)
            ->firstOrFail()
        );
    }

    public function findById(string $id): Product
    {
        return Product::with('category')->findOrFail($id);
    }

    public function create(array $data): Product
    {
        $data['slug'] = $data['slug'] ?? Str::slug($data['name']);
        $product      = Product::create($data);

        CacheService::bustProducts();

        return $product;
    }

    public function update(Product $product, array $data): Product
    {
        if (isset($data['name']) && !isset($data['slug'])) {
            $data['slug'] = Str::slug($data['name']);
        }

        $product->update($data);

        CacheService::bustProducts();

        return $product->fresh(['category']);
    }

    public function delete(Product $product): void
    {
        $product->delete();
        CacheService::bustProducts();
    }
}