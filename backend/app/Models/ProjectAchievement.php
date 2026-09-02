<?php

namespace App\Models;

use App\Models\Concerns\HasTranslations;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProjectAchievement extends Model
{
    use HasTranslations;

    protected $fillable = ['project_id', 'text', 'position'];

    /** @var list<string> */
    protected array $translatable = ['text'];

    protected function casts(): array
    {
        return $this->translatableCasts();
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }
}
