<?php

namespace App\Http\Middleware;

use App\Services\CacheService;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AddCacheControlHeaders
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // cache headers are added to GET requests only
        if (!$request->isMethod('GET')) {
            return $response->withHeaders([
                'Cache-Control' => 'no-store, no-cache, must-revalidate',
            ]);
        }

        // Determine TTL based on route
        $ttl = $this->resolveTtl($request);

        return $response->withHeaders([
            'Cache-Control' => "public, max-age={$ttl}, s-maxage={$ttl}",
            'X-Cache-TTL'   => (string) $ttl,
        ]);
    }

    private function resolveTtl(Request $request): int
    {
        $path = $request->path();

        if (str_contains($path, 'categories')) {
            return CacheService::TTL_CATEGORIES; // 300s
        }

        if (str_contains($path, 'products')) {
            return CacheService::TTL_PRODUCTS; // 60s
        }

        if (str_contains($path, 'reviews')) {
            return CacheService::TTL_REVIEWS; // 60s
        }

        return 60; // default
    }
}
