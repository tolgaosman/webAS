<?php

namespace App\Models;

use App\Models\Concerns\HasTranslations;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ExperienceAccomplishment extends Model
{
    use HasTranslations;

    protected $fillable = ['experience_id', 'text', 'position'];

    /** @var list<string> */
    protected array $translatable = ['text'];

    protected function casts(): array
    {
        return $this->translatableCasts();
    }

    public function experience(): BelongsTo
    {
        return $this->belongsTo(Experience::class);
    }
}
