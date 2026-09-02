<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();
$blocks = App\Models\ContentBlock::all()->toArray();
echo json_encode($blocks, JSON_PRETTY_PRINT);
