<?php

use App\Http\Controllers\Admin\BioParagraphController;
use App\Http\Controllers\Admin\CertificateController;
use App\Http\Controllers\Admin\ContentBlockController;
use App\Http\Controllers\Admin\CoreSkillController;
use App\Http\Controllers\Admin\EducationController;
use App\Http\Controllers\Admin\ExperienceController;
use App\Http\Controllers\Admin\HobbyController;
use App\Http\Controllers\Admin\LanguageController;
use App\Http\Controllers\Admin\PersonalController;
use App\Http\Controllers\Admin\ProjectController;
use App\Http\Controllers\Admin\SpecialtyController;
use App\Http\Controllers\Admin\ToolkitController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PortfolioController;
use Illuminate\Support\Facades\Route;

// §Faz 3 endpoint list. `throttle:global` wraps every route here the
// same way legacy's globalLimiter (300 req / 15 min) was mounted ahead
// of all routing in server.ts; `throttle:auth` / `throttle:api` then
// stack an additional, stricter limiter on top for the routes that had
// one. Auth cookie/response contract is byte-compatible with legacy
// (see AuthController's docblock); everything under /admin is new
// (§Faz 3 replaced the old whole-object PUT /api/portfolio with
// per-resource REST — see PortfolioWriter's docblock for why).

Route::middleware('throttle:global')->group(function () {
    Route::get('/health', function () {
        return response()->json([
            'status' => 'ok',
            'timestamp' => now()->toJSON(), // matches JS Date.toISOString() exactly
            'security' => '🏰 Çelik Kale Active',
        ]);
    });

    Route::prefix('auth')->group(function () {
        Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:auth');
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me'])->middleware('auth.jwt');
    });

    // Public read + upload.
    Route::prefix('portfolio')->group(function () {
        Route::get('/', [PortfolioController::class, 'index'])->middleware('throttle:api');
        Route::post('/upload-image', [PortfolioController::class, 'uploadImage'])->middleware(['throttle:api', 'auth.jwt']);
    });

    // Admin CRUD — every route requires a valid session.
    Route::prefix('admin')->middleware(['throttle:api', 'auth.jwt'])->group(function () {
        Route::get('/personal', [PersonalController::class, 'show']);
        Route::put('/personal', [PersonalController::class, 'update']);

        Route::get('/content-blocks', [ContentBlockController::class, 'index']);
        Route::put('/content-blocks', [ContentBlockController::class, 'update']);

        $simpleResources = [
            'core-skills' => CoreSkillController::class,
            'education' => EducationController::class,
            'languages' => LanguageController::class,
            'toolkit' => ToolkitController::class,
            'certificates' => CertificateController::class,
            'bio-paragraphs' => BioParagraphController::class,
            'hobbies' => HobbyController::class,
            'specialties' => SpecialtyController::class,
            'projects' => ProjectController::class,
            'experience' => ExperienceController::class,
        ];

        foreach ($simpleResources as $slug => $controller) {
            Route::get("/{$slug}", [$controller, 'index']);
            Route::post("/{$slug}", [$controller, 'store']);
            Route::put("/{$slug}/{id}", [$controller, 'update'])->whereNumber('id');
            Route::delete("/{$slug}/{id}", [$controller, 'destroy'])->whereNumber('id');
            Route::post("/{$slug}/reorder", [$controller, 'reorder']);
        }
    });
});
