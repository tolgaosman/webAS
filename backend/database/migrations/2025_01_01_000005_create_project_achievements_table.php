<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// Mirrors projects[].achievements[] (string[], max 20 items, 500 chars each).
// i18n (§Faz 2): text is JSON {tr,en,nl}.
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('project_achievements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained()->cascadeOnDelete();
            $table->json('text');
            $table->unsignedInteger('position')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('project_achievements');
    }
};
