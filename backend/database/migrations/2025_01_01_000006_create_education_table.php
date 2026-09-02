<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// Mirrors PortfolioData.education[]. No id/slug published — matches legacy
// shape exactly (array order = position).
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('education', function (Blueprint $table) {
            $table->id();
            $table->string('date', 100);
            $table->string('school', 200);
            $table->string('degree', 200);
            $table->text('desc'); // up to 1000 chars in legacy schema
            $table->unsignedInteger('position')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('education');
    }
};
