<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// Mirrors PortfolioData.projects[]. `slug` is the legacy string id
// ("project-1") and is what PortfolioSerializer publishes as `id` in the
// JSON — never the auto-increment PK. `images` and `achievements` are
// normalized into project_images / project_achievements (see those
// migrations) and rejoined by the serializer.
//
// i18n (§Faz 2): every human-readable field is JSON {tr,en,nl}. `slug`
// and `thumbnail` stay scalar (identifier / file path).
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->string('slug', 50)->unique();
            $table->json('title');
            $table->json('category');
            $table->string('thumbnail', 500)->default('');
            $table->json('description'); // up to 5000 chars per locale in legacy schema
            $table->json('meta_role');
            $table->json('meta_client_label');
            $table->json('meta_client');
            $table->json('meta_tools');
            $table->json('meta_category');
            $table->json('goals');
            $table->unsignedInteger('position')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
