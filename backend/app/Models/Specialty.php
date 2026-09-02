<?php

namespace App\Models;

use App\Models\Concerns\HasTranslations;
use Illuminate\Database\Eloquent\Model;

class Specialty extends Model
{
    use HasTranslations;

    protected $fillable = ['image', 'title', 'desc', 'cta_label', 'cta_href', 'position'];

    /** @var list<string> */
    protected array $translatable = ['title', 'desc', 'cta_label'];

    protected function casts(): array
    {
        return $this->translatableCasts();
    }
}
