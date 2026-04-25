<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Product>
 */
class ProductFactory extends Factory
{
    protected $model = Product::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {

        return [
            'category_id'  => Category::factory(),
            'name'         => $this->faker->unique()->words(3, true),
            'description'  => $this->faker->paragraphs(2, true),
            'price'        => $this->faker->randomFloat(2, 5, 500),
            'stock_qty'    => $this->faker->numberBetween(1, 200),
            'is_published' => $this->faker->boolean(70),
        ];
    }

    public function published(): static
    {
        return $this->state(fn(array $attributes) => [
            'is_published' => true,
        ]);
    }

    public function unpublished(): static
    {
        return $this->state(fn(array $attributes) => [
            'is_published' => false,
        ]);
    }
}
