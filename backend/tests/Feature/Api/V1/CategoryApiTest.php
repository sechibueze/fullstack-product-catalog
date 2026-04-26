<?php

namespace Tests\Feature\Api\V1;

use App\Models\Category;
use App\Models\Product;

class CategoryApiTest extends ApiTestCase
{
    // INDEX 
    public function test_guest_can_list_categories(): void
    {
        Category::factory()->count(3)->create();

        $response = $this->getJson('/api/v1/categories', $this->publicHeaders());

        $response->assertOk()
            ->assertJsonStructure([
                'data' => [['id', 'name', 'slug', 'description']],
                'meta' => ['current_page', 'total', 'per_page'],
            ]);
    }

    public function test_category_list_is_paginated(): void
    {
        Category::factory()->count(20)->create();

        $response = $this->getJson('/api/v1/categories?per_page=5', $this->publicHeaders());

        $response->assertOk()
            ->assertJsonPath('meta.per_page', 5)
            ->assertJsonCount(5, 'data');
    }

    public function test_category_list_includes_product_count(): void
    {
        $category = Category::factory()->create();
        Product::factory()->count(3)->create(['category_id' => $category->id]);

        $response = $this->getJson('/api/v1/categories', $this->publicHeaders());

        $response->assertOk()
            ->assertJsonPath('data.0.products_count', 3);
    }

    // SHOW 
    public function test_guest_can_view_category_by_slug(): void
    {
        $category = Category::factory()->create();

        $response = $this->getJson(
            "/api/v1/categories/{$category->slug}",
            $this->publicHeaders()
        );

        $response->assertOk()
            ->assertJsonPath('data.slug', $category->slug)
            ->assertJsonPath('data.name', $category->name);
    }

    public function test_show_returns_404_for_nonexistent_category(): void
    {
        $response = $this->getJson(
            '/api/v1/categories/does-not-exist',
            $this->publicHeaders()
        );

        $this->assertErrorEnvelope($response, 404);
    }

    // STORE 
    public function test_admin_can_create_category(): void
    {
        $payload = [
            'name'        => 'New Electronics',
            'description' => 'All electronic items',
        ];

        $response = $this->postJson(
            '/api/v1/categories',
            $payload,
            $this->authHeaders()
        );

        $response->assertCreated()
            ->assertJsonPath('data.name', 'New Electronics')
            ->assertJsonPath('data.slug', 'new-electronics');

        $this->assertDatabaseHas('categories', [
            'name' => 'New Electronics',
            'slug' => 'new-electronics',
        ]);
    }

    public function test_guest_cannot_create_category(): void
    {
        $response = $this->postJson(
            '/api/v1/categories',
            ['name' => 'Test'],
            $this->publicHeaders()
        );

        $this->assertErrorEnvelope($response, 401);
    }

    public function test_create_category_validates_required_fields(): void
    {
        $response = $this->postJson(
            '/api/v1/categories',
            [],
            $this->authHeaders()
        );

        $this->assertErrorEnvelope($response, 422);
        $response->assertJsonValidationErrors(['name']);
    }

    public function test_create_category_validates_name_min_length(): void
    {
        $response = $this->postJson(
            '/api/v1/categories',
            ['name' => 'A'],
            $this->authHeaders()
        );

        $this->assertErrorEnvelope($response, 422);
        $response->assertJsonValidationErrors(['name']);
    }

    public function test_create_category_slug_must_be_unique(): void
    {
        Category::factory()->create(['slug' => 'existing-slug']);

        $response = $this->postJson(
            '/api/v1/categories',
            ['name' => 'Test', 'slug' => 'existing-slug'],
            $this->authHeaders()
        );

        $this->assertErrorEnvelope($response, 422);
        $response->assertJsonValidationErrors(['slug']);
    }

    // UPDATE 
    public function test_admin_can_update_category(): void
    {
        $category = Category::factory()->create(['name' => 'Old Name']);

        $response = $this->putJson(
            "/api/v1/categories/{$category->id}",
            ['name' => 'Updated Name'],
            $this->authHeaders()
        );

        $response->assertOk()
            ->assertJsonPath('data.name', 'Updated Name')
            ->assertJsonPath('data.slug', 'updated-name');

        $this->assertDatabaseHas('categories', ['name' => 'Updated Name']);
    }

    public function test_guest_cannot_update_category(): void
    {
        $category = Category::factory()->create();

        $response = $this->putJson(
            "/api/v1/categories/{$category->id}",
            ['name' => 'Updated'],
            $this->publicHeaders()
        );

        $this->assertErrorEnvelope($response, 401);
    }

    // DESTROY 
    public function test_admin_can_delete_category(): void
    {
        $category = Category::factory()->create();

        $response = $this->deleteJson(
            "/api/v1/categories/{$category->id}",
            [],
            $this->authHeaders()
        );

        $response->assertOk()
            ->assertJsonPath('data', null);

        $this->assertSoftDeleted('categories', ['id' => $category->id]);
    }

    public function test_guest_cannot_delete_category(): void
    {
        $category = Category::factory()->create();

        $response = $this->deleteJson(
            "/api/v1/categories/{$category->id}",
            [],
            $this->publicHeaders()
        );

        $this->assertErrorEnvelope($response, 401);
    }

    public function test_delete_nonexistent_category_returns_404(): void
    {
        $response = $this->deleteJson(
            '/api/v1/categories/' . \Illuminate\Support\Str::uuid(),
            [],
            $this->authHeaders()
        );

        $this->assertErrorEnvelope($response, 404);
    }
}