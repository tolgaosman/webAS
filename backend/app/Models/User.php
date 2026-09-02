<?php

namespace App\Models;

// Illuminate\Foundation\Auth\User gives us the standard Laravel user base
// (Authenticatable, notifiable, etc.) — this file simply replaces whatever
// the `laravel new` skeleton generated at app/Models/User.php. Only
// `email` + `password` (bcrypt via Hash::make) are actually used; the
// single admin row is seeded from legacy/backend's ADMIN_EMAIL /
// ADMIN_PASSWORD by database/seeders/AdminUserSeeder.php (see §Faz 5).
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
}
