<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\Review;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Review>
 */
class ReviewFactory extends Factory
{
    protected $model = Review::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'product_id'    => Product::factory(),
            'reviewer_name' => $this->faker->name(),
            'email'         => $this->faker->safeEmail(),
            'rating'        => $this->faker->numberBetween(1, 5),
            'body'          => $this->faker->paragraph(),
            'is_approved'   => $this->faker->boolean(50),
        ];
    }
    
    public function approved(): static
    {
        return $this->state(fn(array $attributes) => [
            'is_approved' => true,
        ]);
    }

    public function unapproved(): static
    {
        return $this->state(fn(array $attributes) => [
            'is_approved' => false,
        ]);
    }
}
