<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Certificate extends Model
{
    protected $fillable = [
        'slug', 'title', 'issuer', 'letter', 'image', 'validity', 'desc', 'position',
    ];
}
