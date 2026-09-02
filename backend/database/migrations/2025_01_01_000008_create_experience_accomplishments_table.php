<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// Mirrors experience[].accomplishments[] (string[], max 20 items, required
// — unlike projects.achievements this array has no legacy default of []).
// i18n (§Faz 2): text is JSON {tr,en,nl}.
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('experience_accomplishments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('experience_id')->constrained('experience')->cascadeOnDelete();
            $table->json('text');
            $table->unsignedInteger('position')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('experience_accomplishments');
    }
};
