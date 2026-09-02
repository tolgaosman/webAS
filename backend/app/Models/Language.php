<?php

namespace App\Models;

use App\Models\Concerns\HasTranslations;
use Illuminate\Database\Eloquent\Model;

class Language extends Model
{
    use HasTranslations;

    protected $fillable = ['name', 'stars', 'position'];

    /** @var list<string> */
    protected array $translatable = ['name'];

    protected function casts(): array
    {
        return [...$this->translatableCasts(), 'stars' => 'integer'];
    }
}
