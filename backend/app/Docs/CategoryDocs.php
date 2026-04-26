<?php

namespace App\Docs;

use OpenApi\Attributes as OA;

class CategoryDocs
{
    #[OA\Get(
        path: '/v1/categories',
        summary: 'List all categories (paginated)',
        tags: ['Categories'],
        parameters: [
            new OA\Parameter(name: 'per_page', in: 'query', required: false, description: 'Items per page (default 15)', schema: new OA\Schema(type: 'integer', example: 15)),
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Paginated list of categories',
                content: new OA\JsonContent(ref: '#/components/schemas/PaginatedCategories'),
            ),
        ],
    )]
    public function index(): void {}

    #[OA\Get(
        path: '/v1/categories/{category}',
        summary: 'Get a single category by slug',
        tags: ['Categories'],
        parameters: [
            new OA\Parameter(name: 'category', in: 'path', required: true, description: 'Category slug', schema: new OA\Schema(type: 'string', example: 'electronics')),
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Category retrieved',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'data', ref: '#/components/schemas/Category'),
                        new OA\Property(property: 'message', type: 'string', example: 'Category retrieved successfully.'),
                    ],
                ),
            ),
            new OA\Response(response: 404, description: 'Category not found'),
        ],
    )]
    public function show(): void {}

    #[OA\Post(
        path: '/v1/categories',
        summary: 'Create a new category',
        security: [['sanctum' => []]],
        tags: ['Categories'],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['name'],
                properties: [
                    new OA\Property(property: 'name', type: 'string', minLength: 2, maxLength: 100, example: 'Electronics'),
                    new OA\Property(property: 'slug', type: 'string', nullable: true, maxLength: 120, example: 'electronics'),
                    new OA\Property(property: 'description', type: 'string', nullable: true, maxLength: 1000, example: 'Electronic devices and gadgets'),
                ],
            ),
        ),
        responses: [
            new OA\Response(
                response: 201,
                description: 'Category created',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'data', ref: '#/components/schemas/Category'),
                        new OA\Property(property: 'message', type: 'string', example: 'Category created successfully.'),
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
        path: '/v1/categories/{category}',
        summary: 'Update a category',
        security: [['sanctum' => []]],
        tags: ['Categories'],
        parameters: [
            new OA\Parameter(name: 'category', in: 'path', required: true, description: 'Category UUID', schema: new OA\Schema(type: 'string', format: 'uuid')),
        ],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'name', type: 'string', minLength: 2, maxLength: 100, example: 'Electronics'),
                    new OA\Property(property: 'slug', type: 'string', nullable: true, maxLength: 120, example: 'electronics'),
                    new OA\Property(property: 'description', type: 'string', nullable: true, maxLength: 1000),
                ],
            ),
        ),
        responses: [
            new OA\Response(
                response: 200,
                description: 'Category updated',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'data', ref: '#/components/schemas/Category'),
                        new OA\Property(property: 'message', type: 'string', example: 'Category updated successfully.'),
                    ],
                ),
            ),
            new OA\Response(response: 401, description: 'Unauthenticated'),
            new OA\Response(response: 404, description: 'Category not found'),
            new OA\Response(
                response: 422,
                description: 'Validation error',
                content: new OA\JsonContent(ref: '#/components/schemas/ErrorResponse'),
            ),
        ],
    )]
    public function update(): void {}

    #[OA\Delete(
        path: '/v1/categories/{category}',
        summary: 'Delete a category (soft delete)',
        security: [['sanctum' => []]],
        tags: ['Categories'],
        parameters: [
            new OA\Parameter(name: 'category', in: 'path', required: true, description: 'Category UUID', schema: new OA\Schema(type: 'string', format: 'uuid')),
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Category deleted',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'data', nullable: true, example: null),
                        new OA\Property(property: 'message', type: 'string', example: 'Category deleted successfully.'),
                    ],
                ),
            ),
            new OA\Response(response: 401, description: 'Unauthenticated'),
            new OA\Response(response: 404, description: 'Category not found'),
        ],
    )]
    public function destroy(): void {}
}
