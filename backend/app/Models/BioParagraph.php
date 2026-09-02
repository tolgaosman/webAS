<?php

namespace App\Models;

use App\Models\Concerns\HasTranslations;
use Illuminate\Database\Eloquent\Model;

class BioParagraph extends Model
{
    use HasTranslations;

    protected $fillable = ['body', 'position'];

    /** @var list<string> */
    protected array $translatable = ['body'];

    protected function casts(): array
    {
        return $this->translatableCasts();
    }
}
