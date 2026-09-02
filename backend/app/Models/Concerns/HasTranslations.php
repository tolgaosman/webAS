<?php

namespace App\Models\Concerns;

use App\Casts\Translatable;

/**
 * Give a model `protected array $translatable = [...]` listing its JSON
 * {tr,en,nl} columns, then merge `$this->translatableCasts()` into that
 * model's own `casts()` method (§Faz 2):
 *
 *   protected array $translatable = ['title', 'desc'];
 *
 *   protected function casts(): array
 *   {
 *       return $this->translatableCasts();
 *   }
 *
 * or, when a model also has non-translatable casts:
 *
 *   protected function casts(): array
 *   {
 *       return [...$this->translatableCasts(), 'stars' => 'integer'];
 *   }
 *
 * This keeps the column list in one place per model instead of repeating
 * `App\Casts\Translatable::class` for every field by hand, and — more
 * importantly — makes that one list directly comparable against the
 * migration's json() columns, which is the highest-value cross-check
 * when adding a new translatable field (see migration plan §Faz 2
 * verification note: a mismatch here produces "Array to string
 * conversion" at runtime, not a clean error).
 */
trait HasTranslations
{
    /**
     * @return array<string, class-string<Translatable>>
     */
    protected function translatableCasts(): array
    {
        return array_fill_keys($this->translatable ?? [], Translatable::class);
    }
}
