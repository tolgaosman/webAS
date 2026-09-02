<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\PortfolioController;
use Illuminate\Support\Facades\Route;

// Byte-compatible with legacy/backend/src/server.ts + routes/*.ts (§Faz 4).
// PATCH /api/portfolio/:section is intentionally NOT ported — the
// frontend never called it and it had no request validation (see
// migration plan, "Faz 4" note under the endpoint table).
//
// `throttle:global` wraps every route here the same way
// legacy's globalLimiter (300 req / 15 min) was mounted ahead of all
// routing in server.ts; `throttle:auth` / `throttle:api` then stack an
// additional, stricter limiter on top for the routes that had one.

Route::middleware('throttle:global')->group(function () {
    Route::get('/health', function () {
        return response()->json([
            'status' => 'ok',
            'timestamp' => now()->toJSON(), // matches JS Date.toISOString() exactly
            'security' => '🏰 Çelik Kale Active',
        ]);
    });

    Route::prefix('auth')->group(function () {
        Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:auth');
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me'])->middleware('auth.jwt');
    });

    Route::prefix('portfolio')->group(function () {
        Route::get('/', [PortfolioController::class, 'index'])->middleware('throttle:api');
        Route::put('/', [PortfolioController::class, 'update'])->middleware(['throttle:api', 'auth.jwt']);
        Route::post('/upload-image', [PortfolioController::class, 'uploadImage'])->middleware(['throttle:api', 'auth.jwt']);
    });
});
