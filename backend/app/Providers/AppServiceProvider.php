<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    /**
     * Rate limiters — byte-compatible with
     * legacy/backend/src/middleware/rateLimiter.ts (§Faz 6): same
     * windows, same limits, same Turkish response bodies. Keyed the same
     * way (first X-Forwarded-For entry, else client IP, else "unknown").
     *
     * Wired to routes via `throttle:auth` / `throttle:api` / `throttle:global`
     * (see routes/api.php).
     */
    public function boot(): void
    {
        RateLimiter::for('auth', function (Request $request) {
            return Limit::perMinutes(15, 5)
                ->by($this->rateLimitKey($request))
                ->response(fn () => response()->json([
                    'error' => 'Çok fazla giriş denemesi. Lütfen 15 dakika sonra tekrar deneyin.',
                    'retryAfter' => '15 minutes',
                ], 429));
        });

        RateLimiter::for('api', function (Request $request) {
            return Limit::perMinutes(15, 100)
                ->by($this->rateLimitKey($request))
                ->response(fn () => response()->json([
                    'error' => 'API istek limiti aşıldı. Lütfen biraz bekleyin.',
                    'retryAfter' => '15 minutes',
                ], 429));
        });

        RateLimiter::for('global', function (Request $request) {
            return Limit::perMinutes(15, 300)
                ->by($this->rateLimitKey($request))
                ->response(fn () => response()->json([
                    'error' => 'Çok fazla istek gönderildi. Lütfen bekleyin.',
                ], 429));
        });
    }

    private function rateLimitKey(Request $request): string
    {
        $forwarded = $request->header('X-Forwarded-For');
        if ($forwarded) {
            return trim(explode(',', $forwarded)[0]);
        }

        return $request->ip() ?? 'unknown';
    }
}
