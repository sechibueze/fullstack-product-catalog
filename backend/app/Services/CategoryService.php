<?php

namespace App\Services;

use App\Models\Category;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Str;

class CategoryService
{
    public function list(int $perPage = 15): LengthAwarePaginator
    {
        return Category::withCount('products')
            ->orderBy('name')
            ->paginate($perPage);
    }

    public function findBySlug(string $slug): Category
    {
        return Category::withCount('products')
            ->where('slug', $slug)
            ->firstOrFail();
    }

    public function findById(string $id): Category
    {
        return Category::findOrFail($id);
    }

    public function create(array $data): Category
    {
        $data['slug'] = $data['slug'] ?? Str::slug($data['name']);
        return Category::create($data);
    }

    public function update(Category $category, array $data): Category
    {
        if (isset($data['name']) && !isset($data['slug'])) {
            $data['slug'] = Str::slug($data['name']);
        }
        $category->update($data);
        return $category->fresh();
    }

    public function delete(Category $category): void
    {
        $category->delete();
    }
}