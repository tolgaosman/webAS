<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Personal extends Model
{
    protected $table = 'personal';

    protected $fillable = [
        'name', 'email', 'phone', 'instagram', 'linkedin', 'cv_url', 'profile_image',
    ];
}
