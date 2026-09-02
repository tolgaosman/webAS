<?php

// App-specific config (§Faz 1, fixes hata #2).
//
// WHY THIS FILE EXISTS: AdminJwt, RequireAdminAuth, and SecurityAlerts
// previously called env() directly at runtime. That works during local
// `php artisan serve`, but breaks silently in production: any real
// deploy runs `php artisan config:cache`, which makes Laravel read
// config from a single cached PHP array and makes env() return null for
// anything not explicitly re-read through config(). A raw
// `env('JWT_SECRET') ?: 'fallback_secret_change_in_production'` call
// would then ALWAYS take the fallback branch — every JWT gets signed
// with a secret that's sitting in this repo's git history, and every
// session issued before the cache run keeps validating while every
// session after it doesn't. This is the single most dangerous latent
// bug the previous overlay had.
//
// Fix: read env() only here, once, at config-cache time, and have every
// service call config('webas.*') instead.

return [

    'jwt_secret' => env('JWT_SECRET', 'fallback_secret_change_in_production'),

    'admin_email' => env('ADMIN_EMAIL', 'admin@alarasysn.com'),

    // Read once here by AdminUserSeeder at seed time — never compared at
    // request time (that's what the bcrypt hash in the users table is
    // for). Also affected by the config:cache env() trap (hata #2): a
    // seeder run after config:cache would otherwise silently see null.
    'admin_password' => env('ADMIN_PASSWORD'),

    'failed_login_alert_threshold' => (int) env('FAILED_LOGIN_ALERT_THRESHOLD', 5),

];
