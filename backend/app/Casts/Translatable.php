<?php

namespace App\Casts;

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
        return [$key => json_encode(TranslatedText::from($value)->toArray(), JSON_UNESCAPED_UNICODE)];
    }
}
