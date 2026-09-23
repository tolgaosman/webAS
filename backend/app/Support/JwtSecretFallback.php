<?php

namespace App\Support;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

/**
 * Only ever consulted when JWT_SECRET is unset in the environment (see
 * config/webas.php). A previous version of that config fell back to a
 * hardcoded string committed in this repo's git history
 * ('temp-secret-key-12345-webas-fallback-xyz', itself a replacement for
 * an earlier 'fallback_secret_change_in_production') — anyone who can
 * read this source can forge an admin_token cookie for a site still
 * running on that default, a full authentication bypass. A middleware
 * check used to 500 the whole site instead of accepting that default,
 * but that took the entire admin panel down on any Coolify instance
 * that hadn't set JWT_SECRET yet, which is the more likely failure mode
 * in practice — see commit c462602.
 *
 * This resolves the tension: generate a random secret nobody could have
 * read from source, and persist it to disk so it survives across
 * requests (every login issued while this container is up keeps
 * validating). It does NOT survive a redeploy — storage/ is baked into
 * the image, not a mounted volume (docker-compose.yaml only mounts
 * ./uploads) — so every restart invalidates existing sessions and
 * admins have to log in again. That's a real cost, but it's strictly
 * safer than a secret anyone can read, and setting JWT_SECRET as a
 * proper Coolify env var removes the cost entirely.
 */
class JwtSecretFallback
{
    private const PATH = 'jwt_secret_fallback.key';

    public static function resolve(): string
    {
        $disk = storage_path('app/'.self::PATH);

        try {
            if (is_file($disk)) {
                $existing = trim((string) file_get_contents($disk));
                if ($existing !== '') {
                    return $existing;
                }
            }

            $generated = Str::random(64);
            @mkdir(dirname($disk), 0700, true);
            file_put_contents($disk, $generated);
            @chmod($disk, 0600);

            Log::warning('JWT_SECRET is not set — generated a random per-container fallback. Set JWT_SECRET in the environment to keep admin sessions valid across redeploys.');

            return $generated;
        } catch (\Throwable $e) {
            // storage/app itself isn't writable — fall back to a secret
            // that's at least random per PHP-FPM worker boot, never a
            // value that was ever committed to source control.
            Log::error('JwtSecretFallback: could not persist fallback secret, using an ephemeral one', [
                'message' => $e->getMessage(),
            ]);

            return Str::random(64);
        }
    }
}
