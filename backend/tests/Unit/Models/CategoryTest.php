<?php

namespace Tests\Unit\Models;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CategoryTest extends TestCase
{
    use RefreshDatabase;

    public function test_category_uses_uuid_primary_key(): void
    {
        $category = Category::factory()->create();
        $this->assertMatchesRegularExpression(
            '/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/',
            $category->id
        );
    }

    public function test_category_auto_generates_slug_from_name(): void
    {
        $category = Category::factory()->create(['name' => 'My Test Category']);
        $this->assertEquals('my-test-category', $category->slug);
    }

    public function test_category_has_many_products(): void
    {
        $category = Category::factory()->create();
        Product::factory()->count(3)->create(['category_id' => $category->id]);

        $this->assertCount(3, $category->products);
        $this->assertInstanceOf(Product::class, $category->products->first());
    }

    public function test_category_is_soft_deleted(): void
    {
        $category = Category::factory()->create();
        $id       = $category->id;
        $category->delete();

        $this->assertSoftDeleted('categories', ['id' => $id]);
        $this->assertNull(Category::find($id));
        $this->assertNotNull(Category::withTrashed()->find($id));
    }
}