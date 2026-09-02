<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// New in the i18n rewrite (§Faz 2): the 5 hobby items that were
// hardcoded in frontend/index.html (.hobby-item, lines 387-406) — emoji
// + a label, e.g. "🧘🏻‍♀️ Yoga". `icon` stays scalar (it's a glyph, not
// prose); `label` is translatable even though most of the legacy labels
// (Yoga, Cooking, Photography...) already read the same in every
// language — Alara can still reword them.
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('hobbies', function (Blueprint $table) {
            $table->id();
            $table->string('icon', 8);
            $table->json('label'); // {tr,en,nl}
            $table->unsignedInteger('position')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('hobbies');
    }
};
