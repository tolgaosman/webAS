<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

/**
 * Validates a {tr,en,nl} translatable field on write (§Faz 2) — the one
 * place the "tr is the source of truth" invariant is enforced on write,
 * mirroring the one place it's enforced on read (TranslatedText::get()).
 *
 * Usage in a FormRequest:
 *   'title' => [new TranslatableString(max: 200, required: true)],
 *
 * Accepts a plain array with any subset of tr/en/nl keys — missing
 * locales are treated as "" (matches App\Casts\Translatable::set()),
 * so a request only needs to send the locale(s) actually being edited.
 */
class TranslatableString implements ValidationRule
{
    public function __construct(
        private readonly ?int $max = null,
        private readonly bool $required = true,
    ) {
    }

    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (! is_array($value)) {
            $fail("{$attribute} bir {tr,en,nl} nesnesi olmalı.");

            return;
        }

        $unknownKeys = array_diff(array_keys($value), ['tr', 'en', 'nl']);
        if ($unknownKeys !== []) {
            $fail("{$attribute} yalnızca tr, en, nl anahtarlarını içerebilir.");

            return;
        }

        foreach (['tr', 'en', 'nl'] as $locale) {
            if (! array_key_exists($locale, $value)) {
                continue;
            }

            if ($value[$locale] !== null && ! is_string($value[$locale])) {
                $fail("{$attribute}.{$locale} bir metin olmalı.");

                return;
            }

            if ($this->max !== null && mb_strlen((string) $value[$locale]) > $this->max) {
                $fail("{$attribute}.{$locale} en fazla {$this->max} karakter olabilir.");

                return;
            }
        }

        if ($this->required && trim((string) ($value['tr'] ?? '')) === '') {
            $fail("{$attribute}.tr zorunludur (diğer diller boş bırakılabilir, Türkçeye düşer).");
        }
    }
}
