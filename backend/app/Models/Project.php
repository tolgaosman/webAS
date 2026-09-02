<?php

namespace App\Models;

use App\Models\Concerns\HasTranslations;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Project extends Model
{
    use HasTranslations;

    protected $fillable = [
        'slug', 'title', 'category', 'thumbnail', 'description',
        'meta_role', 'meta_client_label', 'meta_client', 'meta_tools',
        'meta_category', 'goals', 'position',
    ];

    /** @var list<string> */
    protected array $translatable = [
        'title', 'category', 'description',
        'meta_role', 'meta_client_label', 'meta_client', 'meta_tools',
        'meta_category', 'goals',
    ];

    protected function casts(): array
    {
        return $this->translatableCasts();
    }

    public function images(): HasMany
    {
        return $this->hasMany(ProjectImage::class)->orderBy('position');
    }

    public function achievements(): HasMany
    {
        return $this->hasMany(ProjectAchievement::class)->orderBy('position');
    }
}
