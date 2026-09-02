<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ExperienceAccomplishment extends Model
{
    protected $fillable = ['experience_id', 'text', 'position'];

    public function experience(): BelongsTo
    {
        return $this->belongsTo(Experience::class);
    }
}
