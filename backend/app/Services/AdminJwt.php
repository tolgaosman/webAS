<?php

namespace App\Services;

use Firebase\JWT\ExpiredException;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Firebase\JWT\SignatureInvalidException;
use UnexpectedValueException;

/**
 * HS256 JWT issuing/verification, byte-compatible with the legacy Express
 * backend (legacy/backend/src/controllers/auth.controller.ts +
 * legacy/backend/src/middleware/auth.ts). Deliberately reuses the same
 * JWT_SECRET env var and claim shape {uid, email, role, iat, exp} so a
 * session cookie issued by the OLD backend keeps validating after cutover
 * (see migration plan §Faz 5 — this is why firebase/php-jwt was chosen
 * over Sanctum).
 */
class AdminJwt
{
    private const TTL_SECONDS = 2 * 60 * 60; // 2h, matches legacy JWT_EXPIRES_IN="2h" (hardcoded, not read from env)

    public static function issue(string $email): string
    {
        $now = time();
        $payload = [
            'uid' => 'admin',
            'email' => $email,
            'role' => 'admin',
            'iat' => $now,
            'exp' => $now + self::TTL_SECONDS,
        ];

        return JWT::encode($payload, self::secret(), 'HS256');
    }

    /**
     * @return array{uid: string, email: string, role: string}
     *
     * @throws ExpiredException|SignatureInvalidException|UnexpectedValueException
     */
    public static function verify(string $token): array
    {
        $decoded = JWT::decode($token, new Key(self::secret(), 'HS256'));

        return [
            'uid' => $decoded->uid,
            'email' => $decoded->email,
            'role' => $decoded->role,
        ];
    }

    public static function ttlSeconds(): int
    {
        return self::TTL_SECONDS;
    }

    private static function secret(): string
    {
        // Matches legacy's fallback so a misconfigured .env fails the same way.
        return (string) (env('JWT_SECRET') ?: 'fallback_secret_change_in_production');
    }
}
