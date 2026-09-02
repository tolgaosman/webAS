<?php

// Trimmed to what this app uses (§Faz 1). Discord alerting config lives
// here rather than in config/webas.php purely by Laravel convention
// (third-party service credentials go in services.php); SecurityAlerts
// reads it via config('services.discord.webhook_url'), not env()
// directly — see config/webas.php's docblock for why that distinction
// matters (hata #2).

return [

    'discord' => [
        'webhook_url' => env('DISCORD_WEBHOOK_URL'),
    ],

];
