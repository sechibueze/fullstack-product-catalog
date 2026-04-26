<?php

namespace App\Docs;

use OpenApi\Attributes as OA;

class AuthDocs
{
    #[OA\Post(
        path: '/v1/auth/login',
        summary: 'Login and receive a Sanctum token',
        tags: ['Auth'],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['email', 'password'],
                properties: [
                    new OA\Property(property: 'email', type: 'string', format: 'email', example: 'admin@example.com'),
                    new OA\Property(property: 'password', type: 'string', format: 'password', example: 'secret'),
                ],
            ),
        ),
        responses: [
            new OA\Response(
                response: 200,
                description: 'Login successful',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(
                            property: 'data',
                            properties: [
                                new OA\Property(property: 'token', type: 'string', example: '1|abc123xyz'),
                                new OA\Property(
                                    property: 'user',
                                    properties: [
                                        new OA\Property(property: 'id', type: 'string', format: 'uuid'),
                                        new OA\Property(property: 'name', type: 'string', example: 'Admin'),
                                        new OA\Property(property: 'email', type: 'string', format: 'email'),
                                    ],
                                    type: 'object',
                                ),
                            ],
                            type: 'object',
                        ),
                        new OA\Property(property: 'message', type: 'string', example: 'Login successful.'),
                    ],
                ),
            ),
            new OA\Response(
                response: 422,
                description: 'Invalid credentials',
                content: new OA\JsonContent(ref: '#/components/schemas/ErrorResponse'),
            ),
        ],
    )]
    public function login(): void {}

    #[OA\Post(
        path: '/v1/auth/logout',
        summary: 'Revoke the current token',
        security: [['sanctum' => []]],
        tags: ['Auth'],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Logged out',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'data', nullable: true, example: null),
                        new OA\Property(property: 'message', type: 'string', example: 'Logged out successfully.'),
                    ],
                ),
            ),
            new OA\Response(response: 401, description: 'Unauthenticated'),
        ],
    )]
    public function logout(): void {}

    #[OA\Get(
        path: '/v1/auth/me',
        summary: 'Get the authenticated user',
        security: [['sanctum' => []]],
        tags: ['Auth'],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Authenticated user',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(
                            property: 'data',
                            properties: [
                                new OA\Property(property: 'id', type: 'string', format: 'uuid'),
                                new OA\Property(property: 'name', type: 'string', example: 'Admin'),
                                new OA\Property(property: 'email', type: 'string', format: 'email'),
                            ],
                            type: 'object',
                        ),
                        new OA\Property(property: 'message', type: 'string', example: 'Authenticated user retrieved.'),
                    ],
                ),
            ),
            new OA\Response(response: 401, description: 'Unauthenticated'),
        ],
    )]
    public function me(): void {}
}
