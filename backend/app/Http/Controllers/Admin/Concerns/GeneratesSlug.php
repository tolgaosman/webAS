<?php

namespace App\Http\Controllers\Admin\Concerns;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

/**
 * Certificates, projects, and experience entries keep a `slug` column
 * (§Faz 2) purely as a legacy-import artifact — the old string ids like
 * "cert-1"/"project-1"/"exp-1" from portfolio-data.json land there via
 * portfolio:import so a --dry-run review stays human-readable. The new
 * API surface never exposes `slug` and routes by the numeric id instead
 * (§Faz 3), but the column is NOT NULL + UNIQUE, so records created
 * through the admin panel still need *some* value here.
 */
trait GeneratesSlug
{
    /** @param class-string<Model> $modelClass */
    protected function generateUniqueSlug(string $modelClass, string $seed): string
    {
        $base = Str::slug($seed) ?: 'item';
        $slug = $base . '-' . Str::lower(Str::random(6));

        while ($modelClass::query()->where('slug', $slug)->exists()) {
            $slug = $base . '-' . Str::lower(Str::random(6));
        }

        return $slug;
    }
}
