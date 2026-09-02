<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// New in the i18n rewrite (§Faz 2): the 4 "Hakkımda" biography
// paragraphs that were hardcoded in frontend/index.html
// (.about-bio-card, lines 360-378) and existed nowhere in
// portfolio-data.json or the admin panel. Seeded from that HTML by
// database/seeders/StaticContentSeeder.php (§Faz 4).
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bio_paragraphs', function (Blueprint $table) {
            $table->id();
            $table->json('body'); // {tr,en,nl}
            $table->unsignedInteger('position')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bio_paragraphs');
    }
};
