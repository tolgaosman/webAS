<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// Mirrors PortfolioData.education[]. No id/slug published — matches legacy
// shape exactly (array order = position).
// i18n (§Faz 2): date/degree/desc are JSON {tr,en,nl} — "date" is
// translatable because it contains language-specific month names and
// words like "Present"/"Şu an". `school` stays scalar (proper noun).
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('education', function (Blueprint $table) {
            $table->id();
            $table->json('date');
            $table->string('school', 200);
            $table->json('degree');
            $table->json('desc'); // up to 1000 chars per locale in legacy schema
            $table->unsignedInteger('position')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('education');
    }
};
