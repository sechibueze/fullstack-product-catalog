<?php

namespace App\Services;

use App\Models\Category;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Str;

class CategoryService
{
    public function list(int $perPage = 15): LengthAwarePaginator
    {
        $page = request()->query('page', 1);
        $key  = CacheService::categoryListKey($page, $perPage);

        return CacheService::categories()->remember(
            $key,
            CacheService::TTL_CATEGORIES,
            fn() => Category::withCount('products')
                ->orderBy('name')
                ->paginate($perPage)
        );
    }
    public function findBySlug(string $slug): Category
    {
        $key = CacheService::categoryDetailKey($slug);

        return CacheService::categories()->remember(
            $key,
            CacheService::TTL_CATEGORIES,
            fn() => Category::withCount('products')
                ->where('slug', $slug)
                ->firstOrFail()
        );
    }

    public function findById(string $id): Category
    {
        return Category::findOrFail($id);
    }

    public function create(array $data): Category
    {
        $data['slug'] = $data['slug'] ?? Str::slug($data['name']);
        $category     = Category::create($data);

        CacheService::bustCategories(); // bust all category cache

        return $category;
    }

    public function update(Category $category, array $data): Category
    {
        if (isset($data['name']) && !isset($data['slug'])) {
            $data['slug'] = Str::slug($data['name']);
        }

        $oldSlug = $category->slug;
        $category->update($data);

        CacheService::bustCategories();

        return $category->fresh();
    }

    public function delete(Category $category): void
    {
        $category->delete();
        CacheService::bustCategories();
        CacheService::bustProducts(); // products in this category may be affected
    }
}