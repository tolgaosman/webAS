<?php

namespace App\Models;

use App\Models\Concerns\HasTranslations;
use Illuminate\Database\Eloquent\Model;

class Certificate extends Model
{
    use HasTranslations;

    protected $fillable = [
        'slug', 'title', 'issuer', 'letter', 'image', 'validity', 'desc', 'position',
    ];

    /** @var list<string> */
    protected array $translatable = ['title', 'validity', 'desc'];

    protected function casts(): array
    {
        return $this->translatableCasts();
    }
}
