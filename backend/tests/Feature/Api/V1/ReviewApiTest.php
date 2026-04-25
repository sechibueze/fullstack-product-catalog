<?php

namespace Tests\Feature\Api\V1;

use App\Models\Category;
use App\Models\Product;
use App\Models\Review;

class ReviewApiTest extends ApiTestCase
{
    private Product $product;

    protected function setUp(): void
    {
        parent::setUp();
        $category      = Category::factory()->create();
        $this->product = Product::factory()->published()->create([
            'category_id' => $category->id,
        ]);
    }

    // PUBLIC SUBMISSION 
    public function test_guest_can_submit_review(): void
    {
        $payload = [
            'reviewer_name' => 'Jane Doe',
            'email'         => 'jane@example.com',
            'rating'        => 5,
            'body'          => 'This is an excellent product review.',
        ];

        $response = $this->postJson(
            "/api/v1/products/{$this->product->slug}/reviews",
            $payload,
            $this->publicHeaders()
        );

        $response->assertCreated()
            ->assertJsonPath('data.reviewer_name', 'Jane Doe')
            ->assertJsonPath('data.is_approved', false); // pending by default

        $this->assertDatabaseHas('reviews', [
            'reviewer_name' => 'Jane Doe',
            'email'         => 'jane@example.com',
            'rating'        => 5,
        ]);
    }

    public function test_review_submission_validates_required_fields(): void
    {
        $response = $this->postJson(
            "/api/v1/products/{$this->product->slug}/reviews",
            [],
            $this->publicHeaders()
        );

        $this->assertErrorEnvelope($response, 422);
        $response->assertJsonValidationErrors([
            'reviewer_name', 'email', 'rating', 'body',
        ]);
    }

    public function test_review_rating_must_be_between_1_and_5(): void
    {
        $response = $this->postJson(
            "/api/v1/products/{$this->product->slug}/reviews",
            [
                'reviewer_name' => 'Jane',
                'email'         => 'jane@example.com',
                'rating'        => 6,
                'body'          => 'Great product!',
            ],
            $this->publicHeaders()
        );

        $this->assertErrorEnvelope($response, 422);
        $response->assertJsonValidationErrors(['rating']);
    }

    public function test_review_body_must_have_minimum_length(): void
    {
        $response = $this->postJson(
            "/api/v1/products/{$this->product->slug}/reviews",
            [
                'reviewer_name' => 'Jane',
                'email'         => 'jane@example.com',
                'rating'        => 4,
                'body'          => 'Short',
            ],
            $this->publicHeaders()
        );

        $this->assertErrorEnvelope($response, 422);
        $response->assertJsonValidationErrors(['body']);
    }

    public function test_review_submission_returns_404_for_nonexistent_product(): void
    {
        $response = $this->postJson(
            '/api/v1/products/non-existent-product/reviews',
            [
                'reviewer_name' => 'Jane',
                'email'         => 'jane@example.com',
                'rating'        => 5,
                'body'          => 'Great product review here.',
            ],
            $this->publicHeaders()
        );

        $this->assertErrorEnvelope($response, 404);
    }

    // APPROVE / REJECT 
    public function test_admin_can_approve_review(): void
    {
        $review = Review::factory()->unapproved()->create([
            'product_id' => $this->product->id,
        ]);

        $response = $this->patchJson(
            "/api/v1/reviews/{$review->id}/approve",
            [],
            $this->authHeaders()
        );

        $response->assertOk()
            ->assertJsonPath('data.is_approved', true);

        $this->assertDatabaseHas('reviews', [
            'id'          => $review->id,
            'is_approved' => true,
        ]);
    }

    public function test_admin_can_reject_review(): void
    {
        $review = Review::factory()->approved()->create([
            'product_id' => $this->product->id,
        ]);

        $response = $this->patchJson(
            "/api/v1/reviews/{$review->id}/reject",
            [],
            $this->authHeaders()
        );

        $response->assertOk()
            ->assertJsonPath('data.is_approved', false);
    }

    public function test_guest_cannot_approve_review(): void
    {
        $review = Review::factory()->unapproved()->create([
            'product_id' => $this->product->id,
        ]);

        $response = $this->patchJson(
            "/api/v1/reviews/{$review->id}/approve",
            [],
            $this->publicHeaders()
        );

        $this->assertErrorEnvelope($response, 401);
    }

    // LIST 
    public function test_admin_can_list_all_reviews(): void
    {
        Review::factory()->count(3)->approved()->create([
            'product_id' => $this->product->id,
        ]);
        Review::factory()->count(2)->unapproved()->create([
            'product_id' => $this->product->id,
        ]);

        $response = $this->getJson(
            '/api/v1/reviews',
            $this->authHeaders()
        );

        $response->assertOk()
            ->assertJsonCount(5, 'data');
    }

    public function test_reviews_can_be_filtered_by_approval_status(): void
    {
        Review::factory()->count(3)->approved()->create([
            'product_id' => $this->product->id,
        ]);
        Review::factory()->count(2)->unapproved()->create([
            'product_id' => $this->product->id,
        ]);

        $response = $this->getJson(
            '/api/v1/reviews?is_approved=true',
            $this->authHeaders()
        );

        $response->assertOk()
            ->assertJsonCount(3, 'data');
    }

    // DESTROY 
    public function test_admin_can_delete_review(): void
    {
        $review = Review::factory()->create([
            'product_id' => $this->product->id,
        ]);

        $response = $this->deleteJson(
            "/api/v1/reviews/{$review->id}",
            [],
            $this->authHeaders()
        );

        $response->assertOk();
        $this->assertDatabaseMissing('reviews', ['id' => $review->id]);
    }
}