<?php

namespace App\Docs;

use OpenApi\Attributes as OA;

class ReviewDocs
{
    #[OA\Get(
        path: '/v1/reviews',
        summary: 'List reviews (paginated)',
        tags: ['Reviews'],
        parameters: [
            new OA\Parameter(name: 'product_id', in: 'query', required: false, description: 'Filter by product UUID', schema: new OA\Schema(type: 'string', format: 'uuid')),
            new OA\Parameter(name: 'is_approved', in: 'query', required: false, description: 'Filter by approval status', schema: new OA\Schema(type: 'boolean')),
            new OA\Parameter(name: 'per_page', in: 'query', required: false, description: 'Items per page (default 15)', schema: new OA\Schema(type: 'integer', example: 15)),
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Paginated list of reviews',
                content: new OA\JsonContent(ref: '#/components/schemas/PaginatedReviews'),
            ),
        ],
    )]
    public function index(): void {}

    #[OA\Get(
        path: '/v1/reviews/{review}',
        summary: 'Get a single review',
        tags: ['Reviews'],
        parameters: [
            new OA\Parameter(name: 'review', in: 'path', required: true, description: 'Review UUID', schema: new OA\Schema(type: 'string', format: 'uuid')),
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Review retrieved',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'data', ref: '#/components/schemas/Review'),
                        new OA\Property(property: 'message', type: 'string', example: 'Review retrieved successfully.'),
                    ],
                ),
            ),
            new OA\Response(response: 404, description: 'Review not found'),
        ],
    )]
    public function show(): void {}

    #[OA\Post(
        path: '/v1/products/{product}/reviews',
        summary: 'Submit a review for a product',
        description: 'Public endpoint. Rate-limited to 5 requests per minute. Review is pending approval after submission.',
        tags: ['Reviews'],
        parameters: [
            new OA\Parameter(name: 'product', in: 'path', required: true, description: 'Product slug', schema: new OA\Schema(type: 'string', example: 'iphone-15')),
        ],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['reviewer_name', 'email', 'rating', 'body'],
                properties: [
                    new OA\Property(property: 'reviewer_name', type: 'string', minLength: 2, maxLength: 100, example: 'Jane Doe'),
                    new OA\Property(property: 'email', type: 'string', format: 'email', example: 'jane@example.com'),
                    new OA\Property(property: 'rating', type: 'integer', minimum: 1, maximum: 5, example: 4),
                    new OA\Property(property: 'body', type: 'string', minLength: 10, maxLength: 2000, example: 'Great product, highly recommended!'),
                ],
            ),
        ),
        responses: [
            new OA\Response(
                response: 201,
                description: 'Review submitted (pending approval)',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'data', ref: '#/components/schemas/Review'),
                        new OA\Property(property: 'message', type: 'string', example: 'Review submitted successfully. It will appear after approval.'),
                    ],
                ),
            ),
            new OA\Response(response: 404, description: 'Product not found'),
            new OA\Response(response: 429, description: 'Too many requests'),
            new OA\Response(
                response: 422,
                description: 'Validation error',
                content: new OA\JsonContent(ref: '#/components/schemas/ErrorResponse'),
            ),
        ],
    )]
    public function store(): void {}

    #[OA\Put(
        path: '/v1/reviews/{review}',
        summary: 'Update a review',
        security: [['sanctum' => []]],
        tags: ['Reviews'],
        parameters: [
            new OA\Parameter(name: 'review', in: 'path', required: true, description: 'Review UUID', schema: new OA\Schema(type: 'string', format: 'uuid')),
        ],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'reviewer_name', type: 'string', minLength: 2, maxLength: 100),
                    new OA\Property(property: 'email', type: 'string', format: 'email'),
                    new OA\Property(property: 'rating', type: 'integer', minimum: 1, maximum: 5),
                    new OA\Property(property: 'body', type: 'string', minLength: 10, maxLength: 2000),
                    new OA\Property(property: 'is_approved', type: 'boolean'),
                ],
            ),
        ),
        responses: [
            new OA\Response(
                response: 200,
                description: 'Review updated',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'data', ref: '#/components/schemas/Review'),
                        new OA\Property(property: 'message', type: 'string', example: 'Review updated successfully.'),
                    ],
                ),
            ),
            new OA\Response(response: 401, description: 'Unauthenticated'),
            new OA\Response(response: 404, description: 'Review not found'),
            new OA\Response(
                response: 422,
                description: 'Validation error',
                content: new OA\JsonContent(ref: '#/components/schemas/ErrorResponse'),
            ),
        ],
    )]
    public function update(): void {}

    #[OA\Delete(
        path: '/v1/reviews/{review}',
        summary: 'Delete a review',
        security: [['sanctum' => []]],
        tags: ['Reviews'],
        parameters: [
            new OA\Parameter(name: 'review', in: 'path', required: true, description: 'Review UUID', schema: new OA\Schema(type: 'string', format: 'uuid')),
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Review deleted',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'data', nullable: true, example: null),
                        new OA\Property(property: 'message', type: 'string', example: 'Review deleted successfully.'),
                    ],
                ),
            ),
            new OA\Response(response: 401, description: 'Unauthenticated'),
            new OA\Response(response: 404, description: 'Review not found'),
        ],
    )]
    public function destroy(): void {}

    #[OA\Patch(
        path: '/v1/reviews/{review}/approve',
        summary: 'Approve a review',
        security: [['sanctum' => []]],
        tags: ['Reviews'],
        parameters: [
            new OA\Parameter(name: 'review', in: 'path', required: true, description: 'Review UUID', schema: new OA\Schema(type: 'string', format: 'uuid')),
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Review approved',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'data', ref: '#/components/schemas/Review'),
                        new OA\Property(property: 'message', type: 'string', example: 'Review approved successfully.'),
                    ],
                ),
            ),
            new OA\Response(response: 401, description: 'Unauthenticated'),
            new OA\Response(response: 404, description: 'Review not found'),
        ],
    )]
    public function approve(): void {}

    #[OA\Patch(
        path: '/v1/reviews/{review}/reject',
        summary: 'Reject a review',
        security: [['sanctum' => []]],
        tags: ['Reviews'],
        parameters: [
            new OA\Parameter(name: 'review', in: 'path', required: true, description: 'Review UUID', schema: new OA\Schema(type: 'string', format: 'uuid')),
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Review rejected',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'data', ref: '#/components/schemas/Review'),
                        new OA\Property(property: 'message', type: 'string', example: 'Review rejected successfully.'),
                    ],
                ),
            ),
            new OA\Response(response: 401, description: 'Unauthenticated'),
            new OA\Response(response: 404, description: 'Review not found'),
        ],
    )]
    public function reject(): void {}
}
