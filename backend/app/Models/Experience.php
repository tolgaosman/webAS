<?php

namespace App\Models;

use App\Models\Concerns\HasTranslations;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Experience extends Model
{
    use HasTranslations;

    protected $table = 'experience';

    protected $fillable = ['slug', 'date', 'role', 'company', 'position'];

    /** @var list<string> */
    protected array $translatable = ['date', 'role'];

    protected function casts(): array
    {
        return $this->translatableCasts();
    }

    public function accomplishments(): HasMany
    {
        return $this->hasMany(ExperienceAccomplishment::class)->orderBy('position');
    }
}
