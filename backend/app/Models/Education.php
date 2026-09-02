<?php

namespace App\Models;

use App\Models\Concerns\HasTranslations;
use Illuminate\Database\Eloquent\Model;

class Education extends Model
{
    use HasTranslations;

    protected $fillable = ['date', 'school', 'degree', 'desc', 'position'];

    /** @var list<string> */
    protected array $translatable = ['date', 'degree', 'desc'];

    protected function casts(): array
    {
        return $this->translatableCasts();
    }
}
