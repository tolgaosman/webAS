<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * Discord failed-login alerting, ported from
 * legacy/backend/src/services/alerting.ts. The legacy version kept its
 * failed-login map and per-IP cooldown in process memory, which breaks
 * under php-fpm's multi-worker/multi-process model — this version keeps
 * the same 15-minute window / cooldown semantics but backs them with
 * Laravel's cache store (Redis in production, see migration plan §Faz 6)
 * so all workers see the same state.
 */
class SecurityAlerts
{
    private const WINDOW_SECONDS = 15 * 60;
    private const COOLDOWN_SECONDS = 5 * 60;

    public static function recordFailedLogin(string $ip, string $email): void
    {
        $key = "failed_logins:{$ip}";
        $attempts = Cache::get($key, []);
        $attempts[] = ['email' => $email, 'timestamp' => time()];
        // Drop anything outside the sliding window.
        $attempts = array_values(array_filter(
            $attempts,
            fn ($a) => $a['timestamp'] > time() - self::WINDOW_SECONDS
        ));
        Cache::put($key, $attempts, self::WINDOW_SECONDS);

        $threshold = (int) (env('FAILED_LOGIN_ALERT_THRESHOLD') ?: 5);
        if (count($attempts) < $threshold) {
            return;
        }

        $cooldownKey = "failed_login_cooldown:{$ip}";
        if (Cache::has($cooldownKey)) {
            return;
        }
        Cache::put($cooldownKey, true, self::COOLDOWN_SECONDS);

        self::sendSecurityEvent(
            'Şüpheli Giriş Denemeleri',
            sprintf('IP %s adresinden %d başarısız giriş denemesi tespit edildi. Son deneme: %s', $ip, count($attempts), $email),
            0xff0000
        );
    }

    public static function clearFailedLogins(string $ip): void
    {
        Cache::forget("failed_logins:{$ip}");
    }

    public static function sendSecurityEvent(string $title, string $description, int $color = 0xffa500): void
    {
        $webhookUrl = env('DISCORD_WEBHOOK_URL');
        if (! $webhookUrl) {
            return; // Matches legacy: silently no-ops (only logs to console) when unset.
        }

        try {
            Http::timeout(5)->post($webhookUrl, [
                'embeds' => [[
                    'title' => $title,
                    'description' => $description,
                    'color' => $color,
                    'timestamp' => now()->toIso8601String(),
                ]],
            ]);
        } catch (\Throwable $e) {
            Log::warning('Discord alert failed to send', ['error' => $e->getMessage()]);
        }
    }
}
