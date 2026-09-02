<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// Mirrors PortfolioData.projects[]. `slug` is the legacy string id
// ("project-1") and is what PortfolioSerializer publishes as `id` in the
// JSON — never the auto-increment PK. `images` and `achievements` are
// normalized into project_images / project_achievements (see those
// migrations) and rejoined by the serializer.
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->string('slug', 50)->unique();
            $table->string('title', 200);
            $table->string('category', 100);
            $table->string('thumbnail', 500)->default('');
            $table->text('description'); // up to 5000 chars in legacy schema
            $table->string('meta_role', 200)->default('');
            $table->string('meta_client_label', 200)->default('');
            $table->string('meta_client', 200)->default('');
            $table->string('meta_tools', 500)->default('');
            $table->string('meta_category', 200)->default('');
            $table->string('goals', 500)->default('');
            $table->unsignedInteger('position')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
