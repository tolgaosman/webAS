<?php

namespace App\Models;

use App\Models\Concerns\HasTranslations;
use Illuminate\Database\Eloquent\Model;

/**
 * Section headings and other free-text strings keyed by a dotted string
 * (e.g. "section.about.tag", "hero.marketingLabel") — see the
 * 2025_01_01_000015_create_content_blocks_table migration's docblock
 * for the full rationale. Rows are seeded once by
 * database/seeders/StaticContentSeeder.php and only ever updated (never
 * created/deleted) through the admin panel's Section Headings tab.
 */
class ContentBlock extends Model
{
    use HasTranslations;

    protected $fillable = ['key', 'group', 'kind', 'value'];

    /** @var list<string> */
    protected array $translatable = ['value'];

    protected function casts(): array
    {
        return $this->translatableCasts();
    }
}
