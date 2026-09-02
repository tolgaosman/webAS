<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Models\User;
use App\Services\AdminJwt;
use App\Services\SecurityAlerts;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Hash;

/**
 * Byte-compatible port of
 * legacy/backend/src/controllers/auth.controller.ts. Response shapes,
 * status codes, and every Turkish message are unchanged (see migration
 * plan §Faz 5). The one intentional behavior change: credentials are
 * checked against the `users` table with Hash::check() (bcrypt) instead
 * of a plaintext ADMIN_EMAIL/ADMIN_PASSWORD env comparison — the login
 * request/response contract itself is identical.
 *
 * NOTE: routes/api.php must NOT run this cookie through Laravel's
 * EncryptCookies middleware (Laravel 11's default `api` middleware group
 * does not include it) — the raw JWT string is what
 * App\Http\Middleware\RequireAdminAuth decodes, and it's also what lets a
 * cookie issued by the legacy Express backend keep validating through
 * the §Faz 9 cutover.
 */
class AuthController extends Controller
{
    private const COOKIE_NAME = 'auth_token';

    public function login(LoginRequest $request)
    {
        $clientIp = $this->clientIp($request);
        $email = $request->input('email');
        $password = $request->input('password');

        try {
            $user = User::query()->where('email', $email)->first();

            if (! $user || ! Hash::check($password, $user->password)) {
                SecurityAlerts::recordFailedLogin($clientIp, $email);

                return response()->json(['error' => 'Geçersiz e-posta veya şifre.'], 401);
            }

            SecurityAlerts::clearFailedLogins($clientIp);

            $token = AdminJwt::issue($user->email);

            $cookie = Cookie::make(
                self::COOKIE_NAME,
                $token,
                AdminJwt::ttlSeconds() / 60, // Cookie::make takes minutes
                '/',
                null,
                app()->environment('production'),
                true, // httpOnly
                false,
                'strict'
            );

            SecurityAlerts::sendSecurityEvent(
                'Başarılı Giriş',
                "Admin girişi: {$user->email} (IP: {$clientIp})",
                0x00ff00
            );

            return response()->json([
                'success' => true,
                'message' => 'Başarıyla giriş yapıldı.',
            ])->withCookie($cookie);
        } catch (\Throwable $e) {
            SecurityAlerts::recordFailedLogin($clientIp, $email);
            report($e);

            return response()->json(['error' => 'Giriş yapılırken sunucu hatası oluştu.'], 500);
        }
    }

    public function logout(Request $request)
    {
        $cookie = Cookie::forget(self::COOKIE_NAME, '/');

        return response()->json([
            'success' => true,
            'message' => 'Çıkış yapıldı.',
        ])->withCookie($cookie);
    }

    public function me(Request $request)
    {
        $user = $request->attributes->get('admin_user');

        return response()->json([
            'success' => true,
            'user' => ['email' => $user['email']],
        ]);
    }

    private function clientIp(Request $request): string
    {
        $forwarded = $request->header('X-Forwarded-For');
        if ($forwarded) {
            return trim(explode(',', $forwarded)[0]);
        }

        return $request->ip() ?? 'unknown';
    }
}
