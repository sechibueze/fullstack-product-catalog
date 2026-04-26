<?php

namespace Tests\Unit\Models;

use App\Models\Category;
use App\Models\Product;
use App\Models\Review;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReviewTest extends TestCase
{
    use RefreshDatabase;

    private Product $product;

    protected function setUp(): void
    {
        parent::setUp();
        $category      = Category::factory()->create();
        $this->product = Product::factory()->create(['category_id' => $category->id]);
    }

    public function test_review_uses_uuid_primary_key(): void
    {
        $review = Review::factory()->create(['product_id' => $this->product->id]);

        $this->assertMatchesRegularExpression(
            '/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/',
            $review->id
        );
    }

    public function test_review_belongs_to_product(): void
    {
        $review = Review::factory()->create(['product_id' => $this->product->id]);

        $this->assertInstanceOf(Product::class, $review->product);
        $this->assertEquals($this->product->id, $review->product->id);
    }

    public function test_review_auto_sets_created_at(): void
    {
        $review = Review::factory()->create(['product_id' => $this->product->id]);
        $this->assertNotNull($review->created_at);
    }

    public function test_approved_scope_returns_only_approved_reviews(): void
    {
        Review::factory()->count(3)->approved()->create(['product_id' => $this->product->id]);
        Review::factory()->count(2)->unapproved()->create(['product_id' => $this->product->id]);

        $this->assertEquals(3, Review::approved()->count());
    }

    public function test_review_rating_is_cast_to_integer(): void
    {
        $review = Review::factory()->create([
            'product_id' => $this->product->id,
            'rating'     => 4,
        ]);

        $this->assertIsInt($review->rating);
    }
}