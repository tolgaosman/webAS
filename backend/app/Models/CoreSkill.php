<?php

namespace App\Models;

use App\Models\Concerns\HasTranslations;
use Illuminate\Database\Eloquent\Model;

class CoreSkill extends Model
{
    use HasTranslations;

    protected $fillable = ['title', 'desc', 'position'];

    /** @var list<string> */
    protected array $translatable = ['title', 'desc'];

    protected function casts(): array
    {
        return $this->translatableCasts();
    }
}
