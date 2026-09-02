<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProjectAchievement extends Model
{
    protected $fillable = ['project_id', 'text', 'position'];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }
}
