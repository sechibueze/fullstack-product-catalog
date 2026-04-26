<?php

use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Routing\Exception\MethodNotAllowedException;
use Symfony\Component\HttpKernel\Exception\HttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        apiPrefix: 'api',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->statefulApi();
        $middleware->validateCsrfTokens(except: ['api/*']);
        $middleware->appendToGroup('api', [
            \App\Http\Middleware\AddCacheControlHeaders::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        // enforce JSON responses for API routes
        $exceptions->shouldRenderJsonWhen(
            fn(Request $request, Throwable $e) => $request->is('api/*')
        );

        // 401 Unauthenticated 
        $exceptions->render(function (AuthenticationException $e, Request $request) {
            if ($request->is('api/*')) {
                Log::warning('Unauthenticated', [
                    'message' => $e->getMessage(),
                    'url' => $request->fullUrl(),
                    'method' => $request->method(),
                    'user_id' => optional($request->user())->id,
                ]);
                return response()->json([
                    'message' => 'Unauthenticated. Please provide a valid API token.',
                    'errors'  => [],
                ], 401);
            }
        });

        // 404 Model not found 
        $exceptions->render(function (ModelNotFoundException $e, Request $request) {
            if ($request->is('api/*')) {
                Log::error('Model Not Found', [
                    'message' => $e->getMessage(),
                    'model' => $e->getModel(),
                    'url' => $request->fullUrl(),
                    'method' => $request->method(),
                    'user_id' => optional($request->user())->id,
                ]);
                $model = class_basename($e->getModel());
                return response()->json([
                    'message' => "{$model} not found.",
                    'errors'  => [],
                ], 404);
            }
        });

        // 404 Route not found 
        $exceptions->render(function (NotFoundHttpException $e, Request $request) {
            if ($request->is('api/*')) {
                Log::error('Route Not Found', [
                    'message' => $e->getMessage(),
                    'url' => $request->fullUrl(),
                    'method' => $request->method(),
                    'user_id' => optional($request->user())->id,
                ]);
                return response()->json([
                    'message' => 'The requested endpoint does not exist.',
                    'errors'  => [],
                ], 404);
            }
        });

        // 405 Method not allowed 
        $exceptions->render(function (MethodNotAllowedException $e, Request $request) {
            if ($request->is('api/*')) {
                Log::warning('Method Not Allowed', [
                    'message' => $e->getMessage(),
                    'allowed_methods' => $e->getAllowedMethods(),
                    'url' => $request->fullUrl(),
                    'method' => $request->method(),
                    'user_id' => optional($request->user())->id,
                ]);
                return response()->json([
                    'message' => 'HTTP method not allowed for this endpoint.',
                    'errors'  => [],
                ], 405);
            }
        });

        // 422 Validation 
        $exceptions->render(function (ValidationException $e, Request $request) {
            if ($request->is('api/*')) {
                Log::warning('Validation Failed', [
                    'message' => $e->getMessage(),
                    'errors' => $e->errors(),
                    'url' => $request->fullUrl(),
                    'method' => $request->method(),
                    'user_id' => optional($request->user())->id,
                ]);
                return response()->json([
                    'message' => 'The given data was invalid.',
                    'errors'  => $e->errors(),
                ], 422);
            }
        });

        //  Generic HTTP exceptions - 403, 429, and others 
        $exceptions->render(function (HttpException $e, Request $request) {
            if ($request->is('api/*')) {
                Log::error('HTTP Exception', [
                    'message' => $e->getMessage(),
                    'status_code' => $e->getStatusCode(),
                    'exception' => get_class($e),
                    'file' => $e->getFile(),
                    'line' => $e->getLine(),
                    'url' => $request->fullUrl(),
                    'method' => $request->method(),
                    'user_id' => optional($request->user())->id,
                ]);
                return response()->json([
                    'message' => $e->getMessage() ?: 'An HTTP error occurred.',
                    'errors'  => [],
                ], $e->getStatusCode());
            }
        });

        // 500 Catch-all 
        $exceptions->render(function (Throwable $e, Request $request) {
            if ($request->is('api/*')) {
                Log::error('API Exception', [
                    'message' => $e->getMessage(),
                    'exception' => get_class($e),
                    'file' => $e->getFile(),
                    'line' => $e->getLine(),
                    'url' => $request->fullUrl(),
                    'method' => $request->method(),
                    'user_id' => optional($request->user())->id,
                ]);
                $debug   = config('app.debug');
                $message = $debug ? $e->getMessage() : 'An unexpected server error occurred.';

                return response()->json([
                    'message' => $message,
                    'errors'  => $debug ? [
                        'exception' => get_class($e),
                        'file'      => $e->getFile(),
                        'line'      => $e->getLine(),
                        'trace'     => array_slice($e->getTrace(), 0, 5),
                    ] : [],
                ], 500);
            }
        });

    })->create();
