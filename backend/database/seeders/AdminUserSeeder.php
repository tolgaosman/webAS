<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

/**
 * Seeds the single admin user from the same ADMIN_EMAIL / ADMIN_PASSWORD
 * env vars the legacy Express backend read at runtime (§Faz 5) — except
 * here the password is bcrypt-hashed via Hash::make() and stored, instead
 * of being compared in plaintext on every login.
 *
 * Usage: php artisan db:seed --class=AdminUserSeeder
 * (or add AdminUserSeeder::class to DatabaseSeeder::run())
 */
class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        $email = env('ADMIN_EMAIL', 'admin@alarasysn.com');
        $password = env('ADMIN_PASSWORD');

        if (! $password) {
            $this->command?->error('ADMIN_PASSWORD is not set in .env — refusing to seed a blank/default password.');

            return;
        }

        User::query()->updateOrCreate(
            ['email' => $email],
            [
                'name' => 'Admin',
                'password' => Hash::make($password),
                'email_verified_at' => now(),
            ]
        );

        $this->command?->info("Admin user seeded: {$email}");
    }
}
