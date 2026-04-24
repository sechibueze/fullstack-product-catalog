<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\Review;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ReviewSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = Product::all();

        // 10 reviews with some approved/unapproved
        $reviews = [
            [
                'product'       => 'wireless-noise-cancelling-headphones',
                'reviewer_name' => 'Alice Johnson',
                'email'         => 'alice@example.com',
                'rating'        => 5,
                'body'          => 'Absolutely love these headphones! The noise cancellation is superb and battery life is incredible.',
                'is_approved'   => true,
            ],
            [
                'product'       => 'wireless-noise-cancelling-headphones',
                'reviewer_name' => 'Bob Smith',
                'email'         => 'bob@example.com',
                'rating'        => 4,
                'body'          => 'Great sound quality but the ear cushions get a bit uncomfortable after long sessions.',
                'is_approved'   => true,
            ],
            [
                'product'       => '4k-ultra-hd-smart-tv-55',
                'reviewer_name' => 'Carol White',
                'email'         => 'carol@example.com',
                'rating'        => 5,
                'body'          => 'Picture quality is stunning. Setup was easy and the smart features work flawlessly.',
                'is_approved'   => true,
            ],
            [
                'product'       => '4k-ultra-hd-smart-tv-55',
                'reviewer_name' => 'David Brown',
                'email'         => 'david@example.com',
                'rating'        => 3,
                'body'          => 'Good TV but the remote feels cheap and the interface is a bit slow.',
                'is_approved'   => false, 
            ],
            [
                'product'       => 'mechanical-gaming-keyboard',
                'reviewer_name' => 'Eva Martinez',
                'email'         => 'eva@example.com',
                'rating'        => 5,
                'body'          => 'Best keyboard I have ever owned. The tactile feedback is satisfying and the RGB is gorgeous.',
                'is_approved'   => true,
            ],
            [
                'product'       => 'classic-slim-fit-chinos',
                'reviewer_name' => 'Frank Lee',
                'email'         => 'frank@example.com',
                'rating'        => 4,
                'body'          => 'Great fit and comfortable fabric. Runs slightly small so order one size up.',
                'is_approved'   => true,
            ],
            [
                'product'       => 'classic-slim-fit-chinos',
                'reviewer_name' => 'Grace Kim',
                'email'         => 'grace@example.com',
                'rating'        => 2,
                'body'          => 'The color faded after just a few washes. Disappointed with the quality.',
                'is_approved'   => false, 
            ],
            [
                'product'       => 'premium-cotton-hoodie',
                'reviewer_name' => 'Henry Wilson',
                'email'         => 'henry@example.com',
                'rating'        => 5,
                'body'          => 'Incredibly soft and warm. Perfect weight for autumn and spring. Will buy more colors.',
                'is_approved'   => true,
            ],
            [
                'product'       => 'stainless-steel-garden-tool-set',
                'reviewer_name' => 'Iris Taylor',
                'email'         => 'iris@example.com',
                'rating'        => 4,
                'body'          => 'Solid tools, great build quality. The trowel is my favourite piece in the set.',
                'is_approved'   => true,
            ],
            [
                'product'       => 'stainless-steel-garden-tool-set',
                'reviewer_name' => 'James Anderson',
                'email'         => 'james@example.com',
                'rating'        => 3,
                'body'          => 'Decent quality but the handles loosened after a month of regular use.',
                'is_approved'   => false, 
            ],
        ];

        foreach ($reviews as $reviewData) {
            $slug    = $reviewData['product'];
            $product = $products->firstWhere('slug', $slug);

            if (!$product) {
                $this->command->warn("Product not found: {$slug}");
                continue;
            }

            Review::create([
                'id' => (string) Str::uuid(),
                'product_id'    => $product->id,
                'reviewer_name' => $reviewData['reviewer_name'],
                'email'         => $reviewData['email'],
                'rating'        => $reviewData['rating'],
                'body'          => $reviewData['body'],
                'is_approved'   => $reviewData['is_approved'],
            ]);
        }

        $this->command->info('10 reviews seeded successfully');
    }
}
