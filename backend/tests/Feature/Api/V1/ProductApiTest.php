<?php

namespace Tests\Feature\Api\V1;

use App\Models\Category;
use App\Models\Product;
use App\Models\Review;

class ProductApiTest extends ApiTestCase
{
    private Category $category;

    protected function setUp(): void
    {
        parent::setUp();
        $this->category = Category::factory()->create();
    }

    // INDEX 
    public function test_guest_can_list_published_products(): void
    {
        Product::factory()->count(3)->published()->create([
            'category_id' => $this->category->id,
        ]);
        Product::factory()->count(2)->unpublished()->create([
            'category_id' => $this->category->id,
        ]);

        $response = $this->getJson('/api/v1/products', $this->publicHeaders());

        $response->assertOk()
            ->assertJsonCount(3, 'data'); // only published products
    }

    public function test_admin_can_list_all_products(): void
    {
        Product::factory()->count(3)->published()->create([
            'category_id' => $this->category->id,
        ]);
        Product::factory()->count(2)->unpublished()->create([
            'category_id' => $this->category->id,
        ]);

        $response = $this->getJson('/api/v1/products', $this->authHeaders());

        $response->assertOk()
            ->assertJsonCount(5, 'data'); // all the products
    }

    public function test_products_can_be_filtered_by_category(): void
    {
        $otherCategory = Category::factory()->create();

        Product::factory()->count(2)->published()->create([
            'category_id' => $this->category->id,
        ]);
        Product::factory()->count(3)->published()->create([
            'category_id' => $otherCategory->id,
        ]);

        $response = $this->getJson(
            "/api/v1/products?category={$this->category->slug}",
            $this->publicHeaders()
        );

        $response->assertOk()
            ->assertJsonCount(2, 'data');
    }

    public function test_products_are_paginated(): void
    {
        Product::factory()->count(15)->published()->create([
            'category_id' => $this->category->id,
        ]);

        $response = $this->getJson(
            '/api/v1/products?per_page=5',
            $this->publicHeaders()
        );

        $response->assertOk()
            ->assertJsonPath('meta.per_page', 5)
            ->assertJsonCount(5, 'data');
    }

    //  SHOW 
    public function test_guest_can_view_published_product_by_slug(): void
    {
        $product = Product::factory()->published()->create([
            'category_id' => $this->category->id,
        ]);

        $response = $this->getJson(
            "/api/v1/products/{$product->slug}",
            $this->publicHeaders()
        );

        $response->assertOk()
            ->assertJsonPath('data.slug', $product->slug)
            ->assertJsonStructure([
                'data' => [
                    'id', 'name', 'slug', 'price',
                    'stock_qty', 'is_published', 'category',
                ],
            ]);
    }

    public function test_show_returns_404_for_nonexistent_product(): void
    {
        $response = $this->getJson(
            '/api/v1/products/does-not-exist',
            $this->publicHeaders()
        );

        $this->assertErrorEnvelope($response, 404);
    }

    public function test_product_detail_includes_approved_reviews(): void
    {
        $product = Product::factory()->published()->create([
            'category_id' => $this->category->id,
        ]);
        Review::factory()->count(3)->approved()->create([
            'product_id' => $product->id,
        ]);
        Review::factory()->count(2)->unapproved()->create([
            'product_id' => $product->id,
        ]);

        $response = $this->getJson(
            "/api/v1/products/{$product->slug}",
            $this->publicHeaders()
        );

        $response->assertOk()
            ->assertJsonCount(3, 'data.reviews.data');
    }

    // STORE 
    public function test_admin_can_create_product(): void
    {
        $payload = [
            'category_id'  => $this->category->id,
            'name'         => 'Brand New Product',
            'description'  => 'A great product description',
            'price'        => 99.99,
            'stock_qty'    => 50,
            'is_published' => true,
        ];

        $response = $this->postJson(
            '/api/v1/products',
            $payload,
            $this->authHeaders()
        );

        $response->assertCreated()
            ->assertJsonPath('data.name', 'Brand New Product')
            ->assertJsonPath('data.slug', 'brand-new-product')
            ->assertJsonPath('data.price', 99.99);

        $this->assertDatabaseHas('products', [
            'name'  => 'Brand New Product',
            'price' => '99.99',
        ]);
    }

    public function test_guest_cannot_create_product(): void
    {
        $response = $this->postJson(
            '/api/v1/products',
            ['name' => 'Test'],
            $this->publicHeaders()
        );

        $this->assertErrorEnvelope($response, 401);
    }

    public function test_create_product_validates_required_fields(): void
    {
        $response = $this->postJson(
            '/api/v1/products',
            [],
            $this->authHeaders()
        );

        $this->assertErrorEnvelope($response, 422);
        $response->assertJsonValidationErrors([
            'category_id', 'name', 'price', 'stock_qty',
        ]);
    }

    public function test_create_product_validates_price_is_positive(): void
    {
        $response = $this->postJson(
            '/api/v1/products',
            [
                'category_id' => $this->category->id,
                'name'        => 'Test Product',
                'price'       => -10,
                'stock_qty'   => 5,
            ],
            $this->authHeaders()
        );

        $this->assertErrorEnvelope($response, 422);
        $response->assertJsonValidationErrors(['price']);
    }

    public function test_create_product_validates_category_exists(): void
    {
        $response = $this->postJson(
            '/api/v1/products',
            [
                'category_id' => \Illuminate\Support\Str::uuid(),
                'name'        => 'Test Product',
                'price'       => 10.00,
                'stock_qty'   => 5,
            ],
            $this->authHeaders()
        );

        $this->assertErrorEnvelope($response, 422);
        $response->assertJsonValidationErrors(['category_id']);
    }

    // UPDATE 
    public function test_admin_can_update_product(): void
    {
        $product = Product::factory()->create([
            'category_id' => $this->category->id,
        ]);

        $response = $this->putJson(
            "/api/v1/products/{$product->id}",
            ['name' => 'Updated Product Name', 'price' => 149.99],
            $this->authHeaders()
        );

        $response->assertOk()
            ->assertJsonPath('data.name', 'Updated Product Name')
            ->assertJsonPath('data.price', 149.99);
    }

    public function test_admin_can_toggle_product_published_status(): void
    {
        $product = Product::factory()->unpublished()->create([
            'category_id' => $this->category->id,
        ]);

        $response = $this->patchJson(
            "/api/v1/products/{$product->id}",
            ['is_published' => true],
            $this->authHeaders()
        );

        $response->assertOk()
            ->assertJsonPath('data.is_published', true);

        $this->assertDatabaseHas('products', [
            'id'           => $product->id,
            'is_published' => true,
        ]);
    }

    //  DESTROY 
    public function test_admin_can_delete_product(): void
    {
        $product = Product::factory()->create([
            'category_id' => $this->category->id,
        ]);

        $response = $this->deleteJson(
            "/api/v1/products/{$product->id}",
            [],
            $this->authHeaders()
        );

        $response->assertOk();
        $this->assertSoftDeleted('products', ['id' => $product->id]);
    }
}