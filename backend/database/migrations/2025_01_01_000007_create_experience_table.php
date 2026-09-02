<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// Mirrors PortfolioData.experience[]. `slug` is the legacy string id
// ("exp-1"), published as `id` by PortfolioSerializer.
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('experience', function (Blueprint $table) {
            $table->id();
            $table->string('slug', 50)->unique();
            $table->string('date', 100);
            $table->string('role', 200);
            $table->string('company', 200);
            $table->unsignedInteger('position')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('experience');
    }
};
