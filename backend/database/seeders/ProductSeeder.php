<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $electronics  = Category::where('slug', 'electronics')->first();
        $clothing     = Category::where('slug', 'clothing')->first();
        $homeGarden   = Category::where('slug', 'home-and-garden')->first();

        // 8 products in a mix of published/unpublished
        $products = [
            [
                'id' => (string) Str::uuid(),
                'category_id'  => $electronics->id,
                'name'         => 'Wireless Noise-Cancelling Headphones',
                'slug'         => 'wireless-noise-cancelling-headphones',
                'description'  => 'Premium over-ear headphones with active noise cancellation and 30-hour battery life.',
                'price'        => 299.99,
                'stock_qty'    => 50,
                'is_published' => true,
            ],
            [
                'id' => (string) Str::uuid(),
                'category_id'  => $electronics->id,
                'name'         => '4K Ultra HD Smart TV 55"',
                'slug'         => '4k-ultra-hd-smart-tv-55',
                'description'  => 'Stunning 4K display with built-in streaming apps and voice control.',
                'price'        => 799.99,
                'stock_qty'    => 20,
                'is_published' => true,
            ],
            [
                'id' => (string) Str::uuid(),
                'category_id'  => $electronics->id,
                'name'         => 'Mechanical Gaming Keyboard',
                'slug'         => 'mechanical-gaming-keyboard',
                'description'  => 'RGB backlit mechanical keyboard with tactile switches for the best gaming experience.',
                'price'        => 129.99,
                'stock_qty'    => 75,
                'is_published' => true,
            ],
            [
                'id' => (string) Str::uuid(),
                'category_id'  => $electronics->id,
                'name'         => 'Portable Solar Power Bank',
                'slug'         => 'portable-solar-power-bank',
                'description'  => '20000mAh solar-powered portable charger with dual USB ports.',
                'price'        => 49.99,
                'stock_qty'    => 0,
                'is_published' => false, 
            ],
            [
                'id' => (string) Str::uuid(),
                'category_id'  => $clothing->id,
                'name'         => 'Classic Slim Fit Chinos',
                'slug'         => 'classic-slim-fit-chinos',
                'description'  => 'Versatile slim-fit chinos available in multiple colors, perfect for casual and smart-casual looks.',
                'price'        => 59.99,
                'stock_qty'    => 120,
                'is_published' => true,
            ],
            [
                'id' => (string) Str::uuid(),
                'category_id'  => $clothing->id,
                'name'         => 'Premium Cotton Hoodie',
                'slug'         => 'premium-cotton-hoodie',
                'description'  => 'Soft, heavyweight cotton hoodie with kangaroo pocket and drawstring hood.',
                'price'        => 79.99,
                'stock_qty'    => 85,
                'is_published' => true,
            ],
            [
                'id' => (string) Str::uuid(),
                'category_id'  => $homeGarden->id,
                'name'         => 'Stainless Steel Garden Tool Set',
                'slug'         => 'stainless-steel-garden-tool-set',
                'description'  => '5-piece professional garden tool set with ergonomic handles and rust-resistant steel.',
                'price'        => 44.99,
                'stock_qty'    => 30,
                'is_published' => true,
            ],
            [
                'id' => (string) Str::uuid(),
                'category_id'  => $homeGarden->id,
                'name'         => 'Aromatherapy Diffuser Deluxe',
                'slug'         => 'aromatherapy-diffuser-deluxe',
                'description'  => 'Ultrasonic essential oil diffuser with 7 LED colors and auto shut-off.',
                'price'        => 34.99,
                'stock_qty'    => 15,
                'is_published' => false, 
            ],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }

        $this->command->info('8 products seeded successfully');
    }
}
