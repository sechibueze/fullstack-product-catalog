<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Cache\TaggedCache;

class CacheService
{
    // TTLs  
    public const TTL_PRODUCTS   = 60;   
    public const TTL_CATEGORIES = 300;  
    public const TTL_REVIEWS    = 60; // reviews change as often as products

    // Tag groups 
    public const TAG_CATEGORIES = 'categories';
    public const TAG_PRODUCTS   = 'products';
    public const TAG_REVIEWS    = 'reviews';

    //  Key generators 
    public static function categoryListKey(int $page, int $perPage): string
    {
        Log::debug("Generating category list cache key for page {$page} and perPage {$perPage}", ['page' => $page, 'perPage' => $perPage]);
        return "categories.list.page.{$page}.per.{$perPage}";
    }

    public static function categoryDetailKey(string $slug): string
    {
        Log::debug("Generating category detail cache key for slug {$slug}", ['slug' => $slug]);
        return "categories.detail.{$slug}";
    }

    public static function productListKey(
        int $page,
        int $perPage,
        ?string $category = null,
        ?string $search = null,
        bool $publishedOnly = true
    ): string {
        $cat    = $category ?? 'all';
        $srch   = $search   ?? 'none';
        $pub    = $publishedOnly ? '1' : '0';
        Log::debug("Generating product list cache key", ['page' => $page, 'perPage' => $perPage, 'category' => $cat, 'search' => $srch, 'publishedOnly' => $pub]);
        return "products.list.page.{$page}.per.{$perPage}.cat.{$cat}.search.{$srch}.pub.{$pub}";
    }

    public static function productDetailKey(string $slug): string
    {
        Log::debug("Generating product detail cache key for slug {$slug}", ['slug' => $slug]);
        return "products.detail.{$slug}";
    }

    public static function reviewListKey(
        int $page,
        int $perPage,
        ?string $productId = null,
        ?bool $isApproved = null
    ): string {
        $prod     = $productId ?? 'all';
        $approved = is_null($isApproved) ? 'all' : ($isApproved ? '1' : '0');
        Log::debug("Generating review list cache key", ['page' => $page, 'perPage' => $perPage, 'productId' => $prod, 'isApproved' => $approved]);
        return "reviews.list.page.{$page}.per.{$perPage}.product.{$prod}.approved.{$approved}";
    }

    // Tagged cache helpers 
    public static function categories(): \Illuminate\Cache\TaggedCache
    {
        Log::debug("Accessing categories cache", []);
        return Cache::tags([self::TAG_CATEGORIES]);
    }

    public static function products(): \Illuminate\Cache\TaggedCache
    {
        Log::debug("Accessing products cache", []);
        return Cache::tags([self::TAG_PRODUCTS]);
    }

    public static function reviews(): \Illuminate\Cache\TaggedCache
    {
        Log::debug("Accessing reviews cache", []);
        return Cache::tags([self::TAG_REVIEWS]);
    }

    // Cache busters 
    public static function bustCategories(): void
    {
        Log::debug("Busting categories cache", []);
        Cache::tags([self::TAG_CATEGORIES])->flush();
    }

    public static function bustProducts(): void
    {
        Log::debug("Busting products cache", []);
        // Busting products and reviews since reviews are tied to products
        Cache::tags([self::TAG_PRODUCTS, self::TAG_REVIEWS])->flush();
    }

    public static function bustReviews(): void
    {
        Log::debug("Busting reviews cache", []);
        Cache::tags([self::TAG_REVIEWS])->flush();
    }

    public static function bustProductDetail(string $slug): void
    {
        Log::debug("Busting product detail cache", ['slug' => $slug]);
        Cache::tags([self::TAG_PRODUCTS])->forget(
            self::productDetailKey($slug)
        );
    }

    public static function bustCategoryDetail(string $slug): void
    {
        Log::debug("Busting category detail cache", ['slug' => $slug]);
        Cache::tags([self::TAG_CATEGORIES])->forget(
            self::categoryDetailKey($slug)
        );
    }
}