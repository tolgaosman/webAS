<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// Mirrors PortfolioData.coreSkills[]. No id/slug is published in the API
// response (see legacy shape) — array order is carried by `position`.
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('core_skills', function (Blueprint $table) {
            $table->id();
            $table->string('title', 100);
            $table->string('desc', 500);
            $table->unsignedInteger('position')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('core_skills');
    }
};
