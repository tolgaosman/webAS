<?php

namespace App\Http\Middleware;

use App\Services\AdminJwt;
use Closure;
use Firebase\JWT\ExpiredException;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use UnexpectedValueException;

/**
 * Byte-compatible port of legacy/backend/src/middleware/auth.ts::requireAuth.
 * Registered as the "auth.jwt" middleware alias (see bootstrap/app.php).
 * Reads the same HttpOnly `auth_token` cookie the legacy backend set, so
 * a session issued before cutover keeps working after it (see §Faz 5 —
 * this is why AdminJwt reuses the same JWT_SECRET as the old backend).
 */
class RequireAdminAuth
{
    public function handle(Request $request, Closure $next): Response
    {
        $token = $request->cookie('auth_token');

        if (! $token) {
            return response()->json(['error' => 'Oturum bulunamadı. Lütfen giriş yapın.'], 401);
        }

        if (! env('JWT_SECRET')) {
            report(new \RuntimeException('FATAL: JWT_SECRET is not configured'));

            return response()->json(['error' => 'Sunucu yapılandırma hatası.'], 500);
        }

        try {
            $payload = AdminJwt::verify($token);
        } catch (ExpiredException $e) {
            return response()->json(['error' => 'Oturum süresi doldu. Tekrar giriş yapın.'], 401);
        } catch (UnexpectedValueException $e) {
            // Covers Firebase\JWT\SignatureInvalidException and other
            // decode failures, all subclasses of UnexpectedValueException.
            return response()->json(['error' => 'Geçersiz oturum. Tekrar giriş yapın.'], 401);
        } catch (\Throwable $e) {
            return response()->json(['error' => 'Yetkilendirme hatası.'], 401);
        }

        $request->attributes->set('admin_user', $payload);

        return $next($request);
    }
}
