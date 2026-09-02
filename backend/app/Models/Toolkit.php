<?php

namespace App\Models;

use App\Models\Concerns\HasTranslations;
use Illuminate\Database\Eloquent\Model;

class Toolkit extends Model
{
    use HasTranslations;

    protected $table = 'toolkit';

    protected $fillable = ['badge', 'position'];

    /** @var list<string> */
    protected array $translatable = ['badge'];

    protected function casts(): array
    {
        return $this->translatableCasts();
    }
}
