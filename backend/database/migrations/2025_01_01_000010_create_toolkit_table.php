<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// Mirrors PortfolioData.toolkit[] — a flat string[] in the legacy shape,
// so this table has a single `badge` column and no id published.
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('toolkit', function (Blueprint $table) {
            $table->id();
            $table->string('badge', 100);
            $table->unsignedInteger('position')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('toolkit');
    }
};
