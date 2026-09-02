<?php

return [

    'default' => env('FILESYSTEM_DISK', 'local'),

    'disks' => [

        'local' => [
            'driver' => 'local',
            'root' => storage_path('app/private'),
            'serve' => true,
            'throw' => false,
            'report' => false,
        ],

        'public' => [
            'driver' => 'local',
            'root' => storage_path('app/public'),
            'url' => env('APP_URL').'/storage',
            'visibility' => 'public',
            'throw' => false,
            'report' => false,
        ],

        // Portfolio image uploads (PortfolioController::uploadImage). The
        // root MUST equal nginx's `alias /var/www/uploads/` target on the
        // "web" service (see nginx.conf, §Faz 8) and be bind-mounted at
        // the same host path in docker-compose.yml (both "web" and "php"
        // mount ./uploads there) — that's what makes a file written here
        // reachable at the /assets/uploads/<name> URL the controller
        // returns. Files are written directly at the disk root
        // (storeAs('', $filename, 'public_uploads')), NOT under a nested
        // "uploads/" subdirectory — see PortfolioController's docblock
        // for the double-path bug this avoids.
        'public_uploads' => [
            'driver' => 'local',
            'root' => env('UPLOADS_PATH', storage_path('app/public/uploads')),
            'url' => env('APP_URL').'/assets/uploads',
            'visibility' => 'public',
            'throw' => true, // fail loudly instead of silently returning false
            'report' => false,
        ],

    ],

    'links' => [
        public_path('storage') => storage_path('app/public'),
    ],

];
