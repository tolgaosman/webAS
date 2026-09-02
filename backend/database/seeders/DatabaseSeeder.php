<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Deliberately does NOT run the portfolio:import command's data —
     * `php artisan migrate --seed` on a fresh box should give a working
     * site skeleton (admin login + real static content) with an empty
     * portfolio; importing portfolio-data.json stays an explicit,
     * separate step (see migration plan §Faz 4).
     */
    public function run(): void
    {
        $this->call([
            AdminUserSeeder::class,
            StaticContentSeeder::class,
        ]);
    }
}
