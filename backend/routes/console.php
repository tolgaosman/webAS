<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

// Stock Laravel closure command — kept only because bootstrap/app.php
// requires this file to exist (see migration plan §Faz 1, hata #4: its
// absence was a hard boot failure in the previous overlay). Custom
// artisan commands (portfolio:import, etc.) are registered via their
// own #[AsCommand] attribute / class discovery under app/Console/Commands
// and don't need to be listed here.
Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');
