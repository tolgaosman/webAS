<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Experience extends Model
{
    protected $table = 'experience';

    protected $fillable = ['slug', 'date', 'role', 'company', 'position'];

    public function accomplishments(): HasMany
    {
        return $this->hasMany(ExperienceAccomplishment::class)->orderBy('position');
    }
}
