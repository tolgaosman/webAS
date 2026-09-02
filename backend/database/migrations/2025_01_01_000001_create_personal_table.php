<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// Single-row table — mirrors PortfolioData.personal (see legacy Zod schema
// legacy/backend/src/schemas/portfolio.schema.ts::PersonalSchema and the
// migration plan §Faz 4). Always exactly one row (id=1); PortfolioSerializer
// and portfolio:import both assume that.
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
            $table->string('cv_url', 500)->default('');
            $table->string('profile_image', 500)->default('');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('personal');
    }
};
