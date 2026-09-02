<?php

// Byte-compatible with legacy/backend/src/server.ts's CORS setup (§Faz 6):
// allow-list from ALLOWED_ORIGINS (comma-separated env var), credentials
// enabled, same method/header allow-list, same 24h preflight cache.
// Requests with no Origin header are allowed through either way (Laravel's
// HandleCors middleware only acts when an Origin header is present, same
// as the legacy `if (!origin) callback(null, true)` branch).

$allowedOrigins = array_values(array_filter(array_map(
    'trim',
    explode(',', env('ALLOWED_ORIGINS', ''))
)));

return [
    'paths' => ['api/*'],

    'allowed_methods' => ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],

    'allowed_origins' => $allowedOrigins,

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['Content-Type', 'Authorization'],

    'exposed_headers' => [],

    'max_age' => 86400,

    'supports_credentials' => true,
];
