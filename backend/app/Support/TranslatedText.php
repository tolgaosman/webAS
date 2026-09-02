<?php

namespace App\Support;

use JsonSerializable;
use Stringable;

/**
 * A translated {tr,en,nl} value, produced/consumed by App\Casts\Translatable
 * (see migration plan §Faz 2). Always carries all three locales — a
 * missing locale is normalized to "" by the cast, never left absent —
 * so callers never need an isset() check, only the empty-string
 * fallback rule in get().
 */
final class TranslatedText implements JsonSerializable, Stringable
{
    public function __construct(
        public readonly string $tr,
        public readonly string $en,
        public readonly string $nl,
    ) {
    }

    /**
     * Resolve to a single string for the given locale (or the app's
     * current locale), falling back to `tr` when the requested locale
     * is empty. `tr` is always the source of truth — see
     * App\Rules\TranslatableString, which enforces that `tr` is
     * non-empty on write so this fallback never bottoms out at "".
     */
    public function get(?string $locale = null): string
    {
        $value = match ($locale ?? app()->getLocale()) {
            'en' => $this->en,
            'nl' => $this->nl,
            default => $this->tr,
        };

        return $value !== '' ? $value : $this->tr;
    }

    /**
     * @return array{tr: string, en: string, nl: string}
     */
    public function toArray(): array
    {
        return ['tr' => $this->tr, 'en' => $this->en, 'nl' => $this->nl];
    }

    public function jsonSerialize(): array
    {
        return $this->toArray();
    }

    public function __toString(): string
    {
        return $this->get();
    }

    /**
     * Accepts a TranslatedText (returned as-is), an array with any
     * subset of tr/en/nl keys (missing keys become ""), or a plain
     * string (becomes {tr: $value, en: "", nl: ""} — this is what makes
     * ImportPortfolioData's localizeDeep() trivial, see §Faz 4).
     */
    public static function from(mixed $value): self
    {
        if ($value instanceof self) {
            return $value;
        }

        if (is_array($value)) {
            return new self(
                tr: (string) ($value['tr'] ?? ''),
                en: (string) ($value['en'] ?? ''),
                nl: (string) ($value['nl'] ?? ''),
            );
        }

        return new self(tr: (string) $value, en: '', nl: '');
    }
}
