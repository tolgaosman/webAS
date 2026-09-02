<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Project extends Model
{
    protected $fillable = [
        'slug', 'title', 'category', 'thumbnail', 'description',
        'meta_role', 'meta_client_label', 'meta_client', 'meta_tools',
        'meta_category', 'goals', 'position',
    ];

    public function images(): HasMany
    {
        return $this->hasMany(ProjectImage::class)->orderBy('position');
    }

    public function achievements(): HasMany
    {
        return $this->hasMany(ProjectAchievement::class)->orderBy('position');
    }
}
