<?php

namespace App\Docs;

use OpenApi\Attributes as OA;

class ProductDocs
{
    #[OA\Get(
        path: '/v1/products',
        summary: 'List products (paginated)',
        description: 'Unauthenticated requests only return published products. Authenticated requests return all.',
        tags: ['Products'],
        parameters: [
            new OA\Parameter(name: 'category', in: 'query', required: false, description: 'Filter by category slug', schema: new OA\Schema(type: 'string', example: 'electronics')),
            new OA\Parameter(name: 'search', in: 'query', required: false, description: 'Search by name or description', schema: new OA\Schema(type: 'string', example: 'iphone')),
            new OA\Parameter(name: 'per_page', in: 'query', required: false, description: 'Items per page (default 12)', schema: new OA\Schema(type: 'integer', example: 12)),
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Paginated list of products',
                content: new OA\JsonContent(ref: '#/components/schemas/PaginatedProducts'),
            ),
        ],
    )]
    public function index(): void {}

    #[OA\Get(
        path: '/v1/products/{product}',
        summary: 'Get a product by slug',
        tags: ['Products'],
        parameters: [
            new OA\Parameter(name: 'product', in: 'path', required: true, description: 'Product slug', schema: new OA\Schema(type: 'string', example: 'iphone-15')),
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Product retrieved',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'data', ref: '#/components/schemas/Product'),
                        new OA\Property(property: 'message', type: 'string', example: 'Product retrieved successfully.'),
                    ],
                ),
            ),
            new OA\Response(response: 404, description: 'Product not found'),
        ],
    )]
    public function show(): void {}

    #[OA\Post(
        path: '/v1/products',
        summary: 'Create a new product',
        security: [['sanctum' => []]],
        tags: ['Products'],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['category_id', 'name', 'price', 'stock_qty'],
                properties: [
                    new OA\Property(property: 'category_id', type: 'string', format: 'uuid', example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'),
                    new OA\Property(property: 'name', type: 'string', minLength: 2, maxLength: 200, example: 'iPhone 15'),
                    new OA\Property(property: 'slug', type: 'string', nullable: true, maxLength: 220, example: 'iphone-15'),
                    new OA\Property(property: 'description', type: 'string', nullable: true, maxLength: 5000),
                    new OA\Property(property: 'price', type: 'number', format: 'float', minimum: 0, maximum: 999999.99, example: 999.99),
                    new OA\Property(property: 'stock_qty', type: 'integer', minimum: 0, maximum: 999999, example: 50),
                    new OA\Property(property: 'is_published', type: 'boolean', example: false),
                ],
            ),
        ),
        responses: [
            new OA\Response(
                response: 201,
                description: 'Product created',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'data', ref: '#/components/schemas/Product'),
                        new OA\Property(property: 'message', type: 'string', example: 'Product created successfully.'),
                    ],
                ),
            ),
            new OA\Response(response: 401, description: 'Unauthenticated'),
            new OA\Response(
                response: 422,
                description: 'Validation error',
                content: new OA\JsonContent(ref: '#/components/schemas/ErrorResponse'),
            ),
        ],
    )]
    public function store(): void {}

    #[OA\Put(
        path: '/v1/products/{product}',
        summary: 'Update a product',
        security: [['sanctum' => []]],
        tags: ['Products'],
        parameters: [
            new OA\Parameter(name: 'product', in: 'path', required: true, description: 'Product UUID', schema: new OA\Schema(type: 'string', format: 'uuid')),
        ],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'category_id', type: 'string', format: 'uuid'),
                    new OA\Property(property: 'name', type: 'string', minLength: 2, maxLength: 200),
                    new OA\Property(property: 'slug', type: 'string', nullable: true, maxLength: 220),
                    new OA\Property(property: 'description', type: 'string', nullable: true, maxLength: 5000),
                    new OA\Property(property: 'price', type: 'number', format: 'float', minimum: 0, maximum: 999999.99),
                    new OA\Property(property: 'stock_qty', type: 'integer', minimum: 0, maximum: 999999),
                    new OA\Property(property: 'is_published', type: 'boolean'),
                ],
            ),
        ),
        responses: [
            new OA\Response(
                response: 200,
                description: 'Product updated',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'data', ref: '#/components/schemas/Product'),
                        new OA\Property(property: 'message', type: 'string', example: 'Product updated successfully.'),
                    ],
                ),
            ),
            new OA\Response(response: 401, description: 'Unauthenticated'),
            new OA\Response(response: 404, description: 'Product not found'),
            new OA\Response(
                response: 422,
                description: 'Validation error',
                content: new OA\JsonContent(ref: '#/components/schemas/ErrorResponse'),
            ),
        ],
    )]
    public function update(): void {}

    #[OA\Delete(
        path: '/v1/products/{product}',
        summary: 'Delete a product (soft delete)',
        security: [['sanctum' => []]],
        tags: ['Products'],
        parameters: [
            new OA\Parameter(name: 'product', in: 'path', required: true, description: 'Product UUID', schema: new OA\Schema(type: 'string', format: 'uuid')),
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Product deleted',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'data', nullable: true, example: null),
                        new OA\Property(property: 'message', type: 'string', example: 'Product deleted successfully.'),
                    ],
                ),
            ),
            new OA\Response(response: 401, description: 'Unauthenticated'),
            new OA\Response(response: 404, description: 'Product not found'),
        ],
    )]
    public function destroy(): void {}
}
