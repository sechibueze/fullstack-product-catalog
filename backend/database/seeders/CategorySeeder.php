<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Seed 3 categoriies to db
        $categories = [
            [
                'id' => (string) Str::uuid(),
                'name'        => 'Electronics',
                'slug'        => 'electronics',
                'description' => 'Latest gadgets, devices, and electronic accessories.',
            ],
            [
                'id' => (string) Str::uuid(),
                'name'        => 'Clothing',
                'slug'        => 'clothing',
                'description' => 'Fashion-forward clothing for men, women, and children.',
            ],
            [
                'id' => (string) Str::uuid(),
                'name'        => 'Home & Garden',
                'slug'        => 'home-and-garden',
                'description' => 'Everything you need to make your home and garden shine.',
            ],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }

        $this->command->info('3 categories seeded successfully');
    }
}
