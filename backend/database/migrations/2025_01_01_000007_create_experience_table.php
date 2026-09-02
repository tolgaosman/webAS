<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// Mirrors PortfolioData.experience[]. `slug` is the legacy string id
// ("exp-1"), published as `id` by PortfolioSerializer.
// i18n (§Faz 2): date/role are JSON {tr,en,nl}. `company` stays scalar
// (proper noun).
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('experience', function (Blueprint $table) {
            $table->id();
            $table->string('slug', 50)->unique();
            $table->json('date');
            $table->json('role');
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
