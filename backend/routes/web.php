<?php

use Illuminate\Support\Facades\Route;

// nginx never routes "/" here in production — the React build (frontend/)
// is what's served at the site root (see nginx.conf, §Faz 8). This route
// only exists because Application::configure()->withRouting(web: ...)
// requires the file to be present; it's a harmless landing point for
// direct hits to the PHP container (e.g. `php artisan serve` during
// local development).
Route::get('/', fn () => response()->json(['status' => 'ok', 'service' => 'webas-backend']));
