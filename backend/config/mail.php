<?php

// Trimmed (§Faz 1). Nothing in this app sends email — the legacy admin
// panel's "forgot password" flow is a stub that just tells the user to
// change ADMIN_PASSWORD server-side (see AuthController's docblock) —
// but MailManager must still resolve without exploding if any framework
// internal ever touches Mail::, so the file stays present with a safe
// "log" default.

return [

    'default' => env('MAIL_MAILER', 'log'),

    'mailers' => [

        'smtp' => [
            'transport' => 'smtp',
            'scheme' => env('MAIL_SCHEME'),
            'url' => env('MAIL_URL'),
            'host' => env('MAIL_HOST', '127.0.0.1'),
            'port' => env('MAIL_PORT', 2525),
            'username' => env('MAIL_USERNAME'),
            'password' => env('MAIL_PASSWORD'),
            'timeout' => null,
        ],

        'log' => [
            'transport' => 'log',
            'channel' => env('MAIL_LOG_CHANNEL'),
        ],

    ],

    'from' => [
        'address' => env('MAIL_FROM_ADDRESS', 'hello@example.com'),
        'name' => env('MAIL_FROM_NAME', env('APP_NAME', 'webAS')),
    ],

];
