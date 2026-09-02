<?php

// Kept at Laravel's stock shape even though the API's own auth flow
// (AuthController + RequireAdminAuth) doesn't use Laravel guards at all —
// Hash::check() and framework internals (e.g. password reset scaffolding,
// if ever added) still read this file, and its absence would break
// artisan commands that touch auth config. Zero runtime cost otherwise.

return [

    'defaults' => [
        'guard' => 'web',
        'passwords' => 'users',
    ],

    'guards' => [
        'web' => [
            'driver' => 'session',
            'provider' => 'users',
        ],
    ],

    'providers' => [
        'users' => [
            'driver' => 'eloquent',
            'model' => App\Models\User::class,
        ],
    ],

    'passwords' => [
        'users' => [
            'provider' => 'users',
            'table' => 'password_reset_tokens',
            'expire' => 60,
            'throttle' => 60,
        ],
    ],

    'password_timeout' => 10800,

];
