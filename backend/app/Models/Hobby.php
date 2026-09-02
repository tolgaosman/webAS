<?php

namespace App\Models;

use App\Models\Concerns\HasTranslations;
use Illuminate\Database\Eloquent\Model;

class Hobby extends Model
{
    use HasTranslations;

    protected $fillable = ['icon', 'label', 'position'];

    /** @var list<string> */
    protected array $translatable = ['label'];

    protected function casts(): array
    {
        return $this->translatableCasts();
    }
}
