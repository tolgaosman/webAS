<?php

use App\Http\Middleware\RequireAdminAuth;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // "api" group intentionally stays framework-default (no
        // EncryptCookies/VerifyCsrfToken) — see AuthController's docblock:
        // the auth_token cookie must round-trip as a raw JWT string so a
        // session issued by the legacy Express backend keeps validating
        // through the §Faz 9 cutover.
        $middleware->alias([
            'auth.jwt' => RequireAdminAuth::class,
        ]);

        // Behind nginx (see docker-compose.yml/nginx.conf, §Faz 8) every
        // request otherwise appears to originate from the container IP,
        // which would bucket ALL traffic into one rate-limit key
        // (AppServiceProvider's throttle:auth/api/global) and make
        // $request->ip() useless for SecurityAlerts. '*' is safe here
        // because nginx is the only thing that can reach php:9000 — it's
        // never exposed directly to the internet.
        $middleware->trustProxies(at: '*');
    })
    ->withExceptions(function (Exceptions $exceptions) {
        // Byte-compatible with legacy/backend/src/server.ts's 404 handler
        // and global error handler (see migration plan §Faz 6).
        //
        // NOTE ON ORDER: Laravel tries renderable() callbacks in REVERSE
        // registration order (most-recently-registered first) and stops
        // at the first one that returns a non-null Response. The generic
        // \Throwable catch-all is registered FIRST here so the more
        // specific NotFoundHttpException/AuthenticationException handlers
        // — registered after it — are the ones actually tried first.
        $exceptions->render(function (\Throwable $e, Request $request) {
            if (! $request->is('api/*')) {
                return null;
            }
            if ($e instanceof \Illuminate\Validation\ValidationException) {
                return null; // handled by FailsWithLegacyShape on the FormRequest
            }

            report($e);

            return response()->json([
                'error' => app()->environment('production')
                    ? 'Sunucu hatası oluştu.'
                    : $e->getMessage(),
            ], 500);
        });

        $exceptions->render(function (\Illuminate\Auth\AuthenticationException $e, Request $request) {
            if ($request->is('api/*')) {
                return response()->json(['error' => 'Oturum bulunamadı. Lütfen giriş yapın.'], 401);
            }
        });

        $exceptions->render(function (\Symfony\Component\HttpKernel\Exception\NotFoundHttpException $e, Request $request) {
            if ($request->is('api/*')) {
                return response()->json(['error' => 'Endpoint bulunamadı.'], 404);
            }
        });
    })
    ->create();
