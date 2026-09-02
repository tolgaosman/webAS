<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// Mirrors PortfolioData.coreSkills[]. No id/slug is published in the API
// response (see legacy shape) — array order is carried by `position`.
// i18n (§Faz 2): title/desc are JSON {tr,en,nl}.
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('core_skills', function (Blueprint $table) {
            $table->id();
            $table->json('title');
            $table->json('desc');
            $table->unsignedInteger('position')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('core_skills');
    }
};
