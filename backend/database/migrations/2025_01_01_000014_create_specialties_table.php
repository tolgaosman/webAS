<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// New in the i18n rewrite (§Faz 2): the 3 "Uzmanlık Alanları" specialty
// panels that were hardcoded in frontend/index.html (.specialty-panel,
// lines 467-497) — an image, title, description, and a CTA button
// linking to another section (e.g. href="#portfolio"). `cta_href` stays
// scalar (an anchor target, not prose); `image` stays scalar (a file
// path).
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('specialties', function (Blueprint $table) {
            $table->id();
            $table->string('image', 500)->default('');
            $table->json('title'); // {tr,en,nl}
            $table->json('desc'); // {tr,en,nl}
            $table->json('cta_label'); // {tr,en,nl}
            $table->string('cta_href', 100)->default('');
            $table->unsignedInteger('position')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('specialties');
    }
};
