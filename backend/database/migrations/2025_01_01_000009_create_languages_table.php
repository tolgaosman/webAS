<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// Mirrors PortfolioData.languages[]. No id published.
// i18n (§Faz 2): name is JSON {tr,en,nl} — e.g. "Türkçe (Native)" /
// "Turkish (Native)" / "Turks (Moedertaal)".
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('languages', function (Blueprint $table) {
            $table->id();
            $table->json('name');
            $table->unsignedTinyInteger('stars'); // 1-5
            $table->unsignedInteger('position')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('languages');
    }
};
