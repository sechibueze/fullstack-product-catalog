<?php

namespace App;

use OpenApi\Attributes as OA;

#[OA\Info(
    title: 'Product Catalog API',
    version: '1.0.0',
    description: 'REST API for the WFD Product Catalog & Review Platform',
    contact: new OA\Contact(email: 'admin@example.com'),
)]
#[OA\Server(
    url: 'http://localhost:8000/api',
    description: 'Local development server',
)]
#[OA\SecurityScheme(
    securityScheme: 'sanctum',
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'token',
    description: 'Enter your Sanctum bearer token',
)]
#[OA\Tag(name: 'Auth', description: 'Authentication')]
#[OA\Tag(name: 'Products', description: 'Product catalog management')]
#[OA\Tag(name: 'Categories', description: 'Product category management')]
#[OA\Tag(name: 'Reviews', description: 'Product review management')]
// Shared schemas 
#[OA\Schema(
    schema: 'ErrorResponse',
    properties: [
        new OA\Property(property: 'message', type: 'string', example: 'The given data was invalid.'),
        new OA\Property(
            property: 'errors',
            type: 'object',
            additionalProperties: new OA\AdditionalProperties(
                type: 'array',
                items: new OA\Items(type: 'string'),
            ),
        ),
    ],
)]
#[OA\Schema(
    schema: 'PaginationMeta',
    properties: [
        new OA\Property(property: 'current_page', type: 'integer', example: 1),
        new OA\Property(property: 'last_page', type: 'integer', example: 5),
        new OA\Property(property: 'per_page', type: 'integer', example: 12),
        new OA\Property(property: 'total', type: 'integer', example: 60),
        new OA\Property(property: 'from', type: 'integer', nullable: true, example: 1),
        new OA\Property(property: 'to', type: 'integer', nullable: true, example: 12),
    ],
)]
#[OA\Schema(
    schema: 'PaginationLinks',
    properties: [
        new OA\Property(property: 'first', type: 'string', nullable: true),
        new OA\Property(property: 'last', type: 'string', nullable: true),
        new OA\Property(property: 'prev', type: 'string', nullable: true),
        new OA\Property(property: 'next', type: 'string', nullable: true),
    ],
)]
//  Resource schemas 
#[OA\Schema(
    schema: 'Category',
    properties: [
        new OA\Property(property: 'id', type: 'string', format: 'uuid', example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'),
        new OA\Property(property: 'name', type: 'string', example: 'Electronics'),
        new OA\Property(property: 'slug', type: 'string', example: 'electronics'),
        new OA\Property(property: 'description', type: 'string', nullable: true, example: 'Electronic devices and gadgets'),
        new OA\Property(property: 'created_at', type: 'string', format: 'date-time'),
        new OA\Property(property: 'updated_at', type: 'string', format: 'date-time'),
        new OA\Property(property: 'products_count', type: 'integer', example: 12),
    ],
)]
#[OA\Schema(
    schema: 'Review',
    properties: [
        new OA\Property(property: 'id', type: 'string', format: 'uuid'),
        new OA\Property(property: 'reviewer_name', type: 'string', example: 'Jane Doe'),
        new OA\Property(property: 'email', type: 'string', format: 'email', example: 'jane@example.com'),
        new OA\Property(property: 'rating', type: 'integer', minimum: 1, maximum: 5, example: 4),
        new OA\Property(property: 'body', type: 'string', example: 'Great product, highly recommended!'),
        new OA\Property(property: 'is_approved', type: 'boolean', example: true),
        new OA\Property(property: 'created_at', type: 'string', format: 'date-time'),
    ],
)]
#[OA\Schema(
    schema: 'Product',
    properties: [
        new OA\Property(property: 'id', type: 'string', format: 'uuid'),
        new OA\Property(property: 'name', type: 'string', example: 'iPhone 15'),
        new OA\Property(property: 'slug', type: 'string', example: 'iphone-15'),
        new OA\Property(property: 'description', type: 'string', nullable: true),
        new OA\Property(property: 'price', type: 'number', format: 'float', example: 999.99),
        new OA\Property(property: 'stock_qty', type: 'integer', example: 50),
        new OA\Property(property: 'is_published', type: 'boolean', example: true),
        new OA\Property(property: 'created_at', type: 'string', format: 'date-time'),
        new OA\Property(property: 'updated_at', type: 'string', format: 'date-time'),
        new OA\Property(property: 'average_rating', type: 'number', format: 'float', nullable: true, example: 4.5),
        new OA\Property(property: 'reviews_count', type: 'integer', example: 10),
        new OA\Property(property: 'approved_reviews_count', type: 'integer', example: 8),
        new OA\Property(property: 'category', ref: '#/components/schemas/Category', nullable: true),
    ],
)]
// Paginated collection schemas 
#[OA\Schema(
    schema: 'PaginatedCategories',
    properties: [
        new OA\Property(property: 'data', type: 'array', items: new OA\Items(ref: '#/components/schemas/Category')),
        new OA\Property(property: 'meta', ref: '#/components/schemas/PaginationMeta'),
        new OA\Property(property: 'links', ref: '#/components/schemas/PaginationLinks'),
    ],
)]
#[OA\Schema(
    schema: 'PaginatedProducts',
    properties: [
        new OA\Property(property: 'data', type: 'array', items: new OA\Items(ref: '#/components/schemas/Product')),
        new OA\Property(property: 'meta', ref: '#/components/schemas/PaginationMeta'),
        new OA\Property(property: 'links', ref: '#/components/schemas/PaginationLinks'),
    ],
)]
#[OA\Schema(
    schema: 'PaginatedReviews',
    properties: [
        new OA\Property(property: 'data', type: 'array', items: new OA\Items(ref: '#/components/schemas/Review')),
        new OA\Property(property: 'meta', ref: '#/components/schemas/PaginationMeta'),
        new OA\Property(property: 'links', ref: '#/components/schemas/PaginationLinks'),
    ],
)]
class OpenApi
{
}
