<?php

namespace Tests\Unit\Models;

use App\Models\Category;
use App\Models\Product;
use App\Models\Review;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProductTest extends TestCase
{
    use RefreshDatabase;

    public function test_product_uses_uuid_primary_key(): void
    {
        $category = Category::factory()->create();
        $product  = Product::factory()->create(['category_id' => $category->id]);

        $this->assertMatchesRegularExpression(
            '/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/',
            $product->id
        );
    }

    public function test_product_auto_generates_slug(): void
    {
        $category = Category::factory()->create();
        $product  = Product::factory()->create([
            'category_id' => $category->id,
            'name'        => 'Amazing Wireless Speaker',
        ]);

        $this->assertEquals('amazing-wireless-speaker', $product->slug);
    }

    public function test_product_belongs_to_category(): void
    {
        $category = Category::factory()->create();
        $product  = Product::factory()->create(['category_id' => $category->id]);

        $this->assertInstanceOf(Category::class, $product->category);
        $this->assertEquals($category->id, $product->category->id);
    }

    public function test_product_has_many_reviews(): void
    {
        $category = Category::factory()->create();
        $product  = Product::factory()->create(['category_id' => $category->id]);
        Review::factory()->count(3)->create(['product_id' => $product->id]);

        $this->assertCount(3, $product->reviews);
    }

    public function test_published_scope_returns_only_published_products(): void
    {
        $category = Category::factory()->create();
        Product::factory()->count(3)->published()->create(['category_id' => $category->id]);
        Product::factory()->count(2)->unpublished()->create(['category_id' => $category->id]);

        $this->assertEquals(3, Product::published()->count());
    }

    public function test_product_is_soft_deleted(): void
    {
        $category = Category::factory()->create();
        $product  = Product::factory()->create(['category_id' => $category->id]);
        $id       = $product->id;
        $product->delete();

        $this->assertSoftDeleted('products', ['id' => $id]);
    }
}