<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// Single-row table — mirrors PortfolioData.personal (see legacy Zod schema
// legacy/backend/src/schemas/portfolio.schema.ts::PersonalSchema and the
// migration plan §Faz 4). Always exactly one row (id=1); PortfolioSerializer
// and portfolio:import both assume that.
//
// i18n (§Faz 2): cv_url is JSON {tr,en,nl} so an English/Dutch CV PDF can
// be served to non-TR visitors, falling back to the TR file when unset
// (see app/Casts/Translatable.php). Everything else here is either an
// address/URL/file path (doesn't get translated) or a proper noun.
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('personal', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->string('email', 254);
            $table->string('phone', 20)->default('');
            $table->string('instagram', 500)->default(''); // URL or ""
            $table->string('linkedin', 500)->default(''); // URL or ""
            $table->json('cv_url'); // {tr,en,nl}
            $table->string('profile_image', 500)->default('');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('personal');
    }
};
