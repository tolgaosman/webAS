<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// Mirrors PortfolioData.certificates[]. `slug` is the legacy string id
// ("cert-1"), published as `id` by PortfolioSerializer.
// i18n (§Faz 2): title/desc/validity are JSON {tr,en,nl} — "validity"
// because its literal prefix ("Geçerlilik: ...") and month names are
// language-specific. `issuer` stays scalar (proper noun).
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('certificates', function (Blueprint $table) {
            $table->id();
            $table->string('slug', 50)->unique();
            $table->json('title');
            $table->string('issuer', 200);
            $table->string('letter', 2); // 1-2 char avatar initial
            $table->string('image', 500)->default('');
            $table->json('validity');
            $table->json('desc'); // up to 1000 chars per locale in legacy schema
            $table->unsignedInteger('position')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('certificates');
    }
};
