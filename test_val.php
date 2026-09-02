<?php
require __DIR__ . '/backend/vendor/autoload.php';
$app = require_once __DIR__ . '/backend/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$rule = new \App\Rules\TranslatableString();

$tests = [
    'string' => "alaraCV.pdf",
    'array_with_empty_string' => ['tr' => 'a', 'en' => '', 'nl' => ''],
    'array_with_null' => ['tr' => 'a', 'en' => null, 'nl' => null],
    'array_with_missing' => ['tr' => 'a'],
    'array_from_json' => json_decode('{"tr":"alaraCV.pdf","en":"","nl":""}', true),
];

foreach ($tests as $name => $value) {
    echo "--- $name ---\n";
    $rule->validate('cv_url', $value, function($msg) { echo "FAIL: $msg\n"; });
}
