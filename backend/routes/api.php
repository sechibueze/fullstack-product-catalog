<?php

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;

Route::get('/health', function () {
    return response()->json([
        'status'    => 'ok',
        'timestamp' => now()->toIso8601String(),
        'services'  => [
            'database' => DB::connection()->getPdo() ? 'connected' : 'error',
            'cache'    => Cache::store('redis')->set('health', 1, 5) ? 'connected' : 'error',
        ],
       
    ]);
});