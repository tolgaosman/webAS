<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// New in the i18n rewrite (§Faz 2): section headings and other free-text
// strings that were hardcoded throughout frontend/index.html and existed
// nowhere in portfolio-data.json — e.g. `section.about.tag` = "Hakkımda",
// `hero.marketingLabel`, `resume.languagesHeading`. Keyed by the
// section's own DOM id (see migration plan §Faz 2 for the full
// rationale) so there's exactly one identifier per section across CSS,
// nav routing, and content, rather than a second mapping table.
//
// `group` is a coarse category for the admin UI to group fields under
// (e.g. "section", "hero", "about", "resume", "contact", "footer").
// `kind` distinguishes a single-line label from a longer free-text
// block, purely as a UI hint for which <TranslatableInput>/
// <TranslatableTextarea> the admin panel renders.
//
// Seeded (never created ad-hoc by the admin) by
// database/seeders/StaticContentSeeder.php (§Faz 4) — the admin's
// Section Headings panel only edits existing keys, hence no `position`
// column; display order there is whatever StaticContentSeeder inserted.
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('content_blocks', function (Blueprint $table) {
            $table->id();
            $table->string('key', 120)->unique();
            $table->string('group', 40);
            $table->enum('kind', ['line', 'rich'])->default('line');
            $table->json('value'); // {tr,en,nl}
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('content_blocks');
    }
};
