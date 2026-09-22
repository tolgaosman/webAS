<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();
try {
    echo "Testing JWT Issue:\n";
    echo App\Services\AdminJwt::issue('alarasoysan@gmail.com') . "\n";
    
    echo "Testing SecurityAlerts:\n";
    App\Services\SecurityAlerts::recordFailedLogin('127.0.0.1', 'alarasoysan@gmail.com');
    echo "OK\n";
} catch (\Throwable $e) {
    echo get_class($e) . ': ' . $e->getMessage() . "\n";
}
