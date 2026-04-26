<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Product\StoreProductRequest;
use App\Http\Requests\Product\UpdateProductRequest;
use App\Http\Resources\ProductCollection;
use App\Http\Resources\ProductResource;
use App\Services\ProductService;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\JsonResponse;

class ProductController extends Controller
{
    public function __construct(
        private readonly ProductService $productService
    ) {}

    public function index(Request $request): ProductCollection
    {
        $filters = [
            'category'       => $request->query('category'),
            'search'         => $request->query('search'),
            'published_only' => !$request->hasHeader('Authorization'),
        ];

        $perPage  = (int) $request->query('per_page', 12);
        $products = $this->productService->list($filters, $perPage);

        return new ProductCollection($products);
    }

    public function show(string $product): JsonResponse
    {
        $model = $this->productService->findBySlug($product);

        return response()->json([
            'data'    => new ProductResource($model),
            'message' => 'Product retrieved successfully.',
        ]);
    }

    public function store(StoreProductRequest $request): JsonResponse
    {
        $product = $this->productService->create($request->validated());

        return response()->json([
            'data'    => new ProductResource($product),
            'message' => 'Product created successfully.',
        ], 201);
    }

    public function update(UpdateProductRequest $request, string $product): JsonResponse
    {
        $model   = $this->productService->findById($product);
        $updated = $this->productService->update($model, $request->validated());

        return response()->json([
            'data'    => new ProductResource($updated),
            'message' => 'Product updated successfully.',
        ]);
    }

    public function destroy(string $product): JsonResponse
    {
        $model = $this->productService->findById($product);
        $this->productService->delete($model);

        return response()->json([
            'data'    => null,
            'message' => 'Product deleted successfully.',
        ]);
    }
}
