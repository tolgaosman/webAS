<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * Fills a {tr,en,nl} translatable field from a single piece of admin-
 * entered text. The admin panel's TR/EN/NL tabs were replaced by one
 * box per field (see App\Casts\Translatable::set(), which calls this
 * whenever exactly one locale arrives non-blank) — this is what fills
 * the other two instead of requiring the admin to type each field three
 * times.
 *
 * Uses Google's public web-frontend translation endpoint (the same one
 * behind translate.google.com and widely used by open-source "free
 * google translate" libraries) rather than the paid, key-based Cloud
 * Translation API — no account/billing setup required. Google does not
 * document or support this endpoint for third-party use, so every call
 * is expected to occasionally fail or get rate-limited; expand() always
 * degrades to *something* usable rather than blocking the save (see the
 * catch block).
 */
class AutoTranslator
{
    private const ENDPOINT = 'https://translate.googleapis.com/translate_a/single';

    private const TARGETS = ['tr', 'en', 'nl'];

    /**
     * @return array{tr: string, en: string, nl: string}
     */
    public static function expand(string $text): array
    {
        $text = trim($text);
        if ($text === '') {
            return ['tr' => '', 'en' => '', 'nl' => ''];
        }

        try {
            // Translating to 'en' first also tells us the detected source
            // language, so a second dedicated detect call isn't needed.
            [$detected, $english] = self::translate($text, 'en');
            $detected ??= 'en';

            $result = [];
            foreach (self::TARGETS as $lang) {
                $result[$lang] = match (true) {
                    $lang === $detected => $text,
                    $lang === 'en' => $english,
                    default => self::translate($text, $lang)[1],
                };
            }

            // `tr` is the site's source-of-truth fallback
            // (TranslatedText::get()) and TranslatableString requires it
            // non-empty on write — never let a translation quirk leave
            // it blank.
            if (trim($result['tr']) === '') {
                $result['tr'] = $text;
            }

            return $result;
        } catch (\Throwable $e) {
            Log::warning('AutoTranslator: translation failed, duplicating source text into every locale', [
                'message' => $e->getMessage(),
            ]);

            return ['tr' => $text, 'en' => $text, 'nl' => $text];
        }
    }

    /**
     * @return array{0: ?string, 1: string} [detectedSourceLanguage, translatedText]
     */
    private static function translate(string $text, string $target): array
    {
        $response = Http::timeout(5)->get(self::ENDPOINT, [
            'client' => 'gtx',
            'sl' => 'auto',
            'tl' => $target,
            'dt' => 't',
            'q' => $text,
        ]);

        if (! $response->successful()) {
            throw new \RuntimeException("translate request failed with status {$response->status()}");
        }

        $json = $response->json();
        if (! is_array($json)) {
            throw new \RuntimeException('translate response was not valid JSON');
        }

        $segments = $json[0] ?? [];
        $translated = collect($segments)->map(fn ($segment) => $segment[0] ?? '')->implode('');
        $detected = is_string($json[2] ?? null) ? $json[2] : null;

        return [$detected, $translated];
    }
}
