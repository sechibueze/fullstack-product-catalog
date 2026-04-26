<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Category\StoreCategoryRequest;
use App\Http\Requests\Category\UpdateCategoryRequest;
use App\Http\Resources\CategoryCollection;
use App\Http\Resources\CategoryResource;
use App\Services\CategoryService;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\JsonResponse;

class CategoryController extends Controller
{
    public function __construct(
        private readonly CategoryService $categoryService
    ) {}

    public function index(Request $request): CategoryCollection
    {
        $perPage    = (int) $request->query('per_page', 15);
        $categories = $this->categoryService->list($perPage);

        return new CategoryCollection($categories);
    }

    public function show(string $category): JsonResponse
    {
        $model = $this->categoryService->findBySlug($category);

        return response()->json([
            'message' => 'Category retrieved successfully.',
            'data'    => new CategoryResource($model),
        ]);
    }

    public function store(StoreCategoryRequest $request): JsonResponse
    {
        $category = $this->categoryService->create($request->validated());

        return response()->json([
            'message' => 'Category created successfully.',
            'data'    => new CategoryResource($category),
        ], 201);
    }

    public function update(UpdateCategoryRequest $request, string $category): JsonResponse
    {
        $model   = $this->categoryService->findById($category);
        $updated = $this->categoryService->update($model, $request->validated());

        return response()->json([
            'data'    => new CategoryResource($updated),
            'message' => 'Category updated successfully.',
        ]);
    }

    public function destroy(string $category): JsonResponse
    {
        $model = $this->categoryService->findById($category);
        $this->categoryService->delete($model);

        return response()->json([
            'data'    => null,
            'message' => 'Category deleted successfully.',
        ]);
    }
}
