<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Review\StoreReviewRequest;
use App\Http\Requests\Review\UpdateReviewRequest;
use App\Http\Resources\ReviewCollection;
use App\Http\Resources\ReviewResource;
use App\Models\Product;
use App\Services\ReviewService;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\JsonResponse;

class ReviewController extends Controller
{
     public function __construct(
        private readonly ReviewService $reviewService
    ) {}

    // GET /api/v1/reviews
    public function index(Request $request): ReviewCollection
    {
        $filters = [
            'is_approved' => $request->has('is_approved')
                ? filter_var($request->query('is_approved'), FILTER_VALIDATE_BOOLEAN)
                : null,
            'product_id'  => $request->query('product_id'),
        ];

        $perPage = (int) $request->query('per_page', 15);
        $reviews = $this->reviewService->list($filters, $perPage);

        return new ReviewCollection($reviews);
    }

    // GET /api/v1/reviews/{review}
    public function show(string $review): JsonResponse
    {
        $model = $this->reviewService->findById($review);

        return response()->json([
            'data'    => new ReviewResource($model),
            'message' => 'Review retrieved successfully.',
        ]);
    }

    // POST /api/v1/products/{product}/reviews — public endpoint
    public function store(StoreReviewRequest $request, string $product): JsonResponse
    {
        $productModel = Product::where('slug', $product)->firstOrFail();

        $review = $this->reviewService->createForProduct(
            $productModel,
            $request->validated()
        );

        return response()->json([
            'data'    => new ReviewResource($review),
            'message' => 'Review submitted successfully. It will appear after approval.',
        ], 201);
    }

    // PUT/PATCH /api/v1/reviews/{review}
    public function update(UpdateReviewRequest $request, string $review): JsonResponse
    {
        $model   = $this->reviewService->findById($review);
        $updated = $this->reviewService->update($model, $request->validated());

        return response()->json([
            'data'    => new ReviewResource($updated),
            'message' => 'Review updated successfully.',
        ]);
    }

    // DELETE /api/v1/reviews/{review}
    public function destroy(string $review): JsonResponse
    {
        $model = $this->reviewService->findById($review);
        $this->reviewService->delete($model);

        return response()->json([
            'data'    => null,
            'message' => 'Review deleted successfully.',
        ]);
    }

    // PATCH /api/v1/reviews/{review}/approve
    public function approve(string $review): JsonResponse
    {
        $model   = $this->reviewService->findById($review);
        $updated = $this->reviewService->approve($model);

        return response()->json([
            'data'    => new ReviewResource($updated),
            'message' => 'Review approved successfully.',
        ]);
    }

    // PATCH /api/v1/reviews/{review}/reject
    public function reject(string $review): JsonResponse
    {
        $model   = $this->reviewService->findById($review);
        $updated = $this->reviewService->reject($model);

        return response()->json([
            'data'    => new ReviewResource($updated),
            'message' => 'Review rejected successfully.',
        ]);
    }
}
