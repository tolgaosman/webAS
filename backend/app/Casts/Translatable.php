<?php

namespace App\Casts;

use App\Services\AutoTranslator;
use App\Support\TranslatedText;
use Illuminate\Contracts\Database\Eloquent\CastsAttributes;
use Illuminate\Database\Eloquent\Model;

/**
 * Eloquent cast for every {tr,en,nl} JSON column (§Faz 2). Applied via
 * App\Models\Concerns\HasTranslations rather than listed by hand in each
 * model's casts() — see that trait's docblock.
 *
 * @implements CastsAttributes<TranslatedText, TranslatedText|array{tr?:string,en?:string,nl?:string}|string>
 */
class Translatable implements CastsAttributes
{
    public function get(Model $model, string $key, mixed $value, array $attributes): TranslatedText
    {
        if ($value === null) {
            return new TranslatedText('', '', '');
        }

        $decoded = is_string($value) ? json_decode($value, true) : $value;

        return TranslatedText::from($decoded ?? []);
    }

    /**
     * @return array<string, string>
     */
    public function set(Model $model, string $key, mixed $value, array $attributes): array
    {
        $incoming = TranslatedText::from($value)->toArray();

        $existingRaw = $attributes[$key] ?? null;
        $existing = is_string($existingRaw) ? json_decode($existingRaw, true) : $existingRaw;

        // The admin panel's per-field TR/EN/NL tabs were replaced by one
        // box that only ever edits `tr` (see TranslatableInput's
        // docblock). Every admin form PUTs its whole record back on
        // every save, so an untouched field's `incoming` still carries
        // whatever en/nl were last loaded into it — those must never be
        // trusted over what's actually stored, only `tr` tells us
        // whether this field was really touched.
        if (is_array($existing)) {
            $incoming = ($existing['tr'] ?? '') === $incoming['tr']
                ? $existing
                : AutoTranslator::expand($incoming['tr']);

            return [$key => json_encode($incoming, JSON_UNESCAPED_UNICODE)];
        }

        // New record: a caller supplying 2+ locales already (bulk import
        // via PortfolioWriter, which already provides curated
        // translations) is trusted as-is; a bare single-locale write
        // (the admin panel's "type once" box, creating something new)
        // is auto-translated.
        $filled = array_filter($incoming, fn (string $v) => trim($v) !== '');
        if (count($filled) === 1) {
            $incoming = AutoTranslator::expand(reset($filled));
        }

        return [$key => json_encode($incoming, JSON_UNESCAPED_UNICODE)];
    }
}
