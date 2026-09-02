<?php

namespace App\Services;

use App\Models\Certificate;
use App\Models\CoreSkill;
use App\Models\Education;
use App\Models\Experience;
use App\Models\ExperienceAccomplishment;
use App\Models\Language;
use App\Models\Personal;
use App\Models\Project;
use App\Models\ProjectAchievement;
use App\Models\ProjectImage;
use App\Models\Toolkit;
use Illuminate\Support\Facades\DB;

/**
 * Replaces the entire portfolio dataset from a DB-ready nested array —
 * i.e. already localized to {tr,en,nl} shape for every translatable
 * field (see App\Casts\Translatable, which also accepts a plain string
 * as shorthand for {tr: $value, en:'', nl:''}), and with `images`
 * already split into a plain array of paths (not the legacy
 * comma-separated string).
 *
 * NOT an HTTP handler (§Faz 3 replaced the old whole-object
 * PUT /api/portfolio with per-resource REST — see
 * app/Http/Controllers/Admin/*) — this class only exists as the shared
 * "replace everything" primitive for the one-off `portfolio:import`
 * command (§Faz 4) and, potentially, future seeders. Wrapped in one DB
 * transaction so a failed import can't leave the site half-written.
 */
class PortfolioWriter
{
    public function replaceAll(array $data): void
    {
        DB::transaction(function () use ($data) {
            $this->writePersonal($data['personal'] ?? []);
            $this->writeCoreSkills($data['coreSkills'] ?? []);
            $this->writeProjects($data['projects'] ?? []);
            $this->writeEducation($data['education'] ?? []);
            $this->writeExperience($data['experience'] ?? []);
            $this->writeLanguages($data['languages'] ?? []);
            $this->writeToolkit($data['toolkit'] ?? []);
            $this->writeCertificates($data['certificates'] ?? []);
        });
    }

    private function writePersonal(array $p): void
    {
        Personal::query()->updateOrCreate(['id' => 1], [
            'name' => $p['name'] ?? '',
            'email' => $p['email'] ?? '',
            'phone' => $p['phone'] ?? '',
            'instagram' => $p['instagram'] ?? '',
            'linkedin' => $p['linkedin'] ?? '',
            'cv_url' => $p['cvUrl'] ?? '',
            'profile_image' => $p['profileImage'] ?? '',
        ]);
    }

    private function writeCoreSkills(array $skills): void
    {
        CoreSkill::query()->delete();
        foreach (array_values($skills) as $i => $s) {
            CoreSkill::query()->create([
                'title' => $s['title'],
                'desc' => $s['desc'],
                'position' => $i,
            ]);
        }
    }

    private function writeProjects(array $projects): void
    {
        // Children cascade-delete via FK (see 2025_01_01_000004/5 migrations).
        Project::query()->delete();
        foreach (array_values($projects) as $i => $p) {
            $proj = Project::query()->create([
                'slug' => $p['slug'] ?? $p['id'] ?? ('project-' . ($i + 1)),
                'title' => $p['title'],
                'category' => $p['category'],
                'thumbnail' => $p['thumbnail'] ?? '',
                'description' => $p['description'],
                'meta_role' => $p['metaRole'] ?? '',
                'meta_client_label' => $p['metaClientLabel'] ?? '',
                'meta_client' => $p['metaClient'] ?? '',
                'meta_tools' => $p['metaTools'] ?? '',
                'meta_category' => $p['metaCategory'] ?? '',
                'goals' => $p['goals'] ?? '',
                'position' => $i,
            ]);

            // `images` must already be a plain array of paths by this point
            // — see this class's docblock. The legacy comma-separated
            // string is split by ImportPortfolioData before it ever
            // reaches here.
            foreach (array_values($p['images'] ?? []) as $j => $path) {
                ProjectImage::query()->create([
                    'project_id' => $proj->id,
                    'path' => $path,
                    'position' => $j,
                ]);
            }

            foreach (array_values($p['achievements'] ?? []) as $j => $text) {
                ProjectAchievement::query()->create([
                    'project_id' => $proj->id,
                    'text' => $text,
                    'position' => $j,
                ]);
            }
        }
    }

    private function writeEducation(array $rows): void
    {
        Education::query()->delete();
        foreach (array_values($rows) as $i => $e) {
            Education::query()->create([
                'date' => $e['date'],
                'school' => $e['school'],
                'degree' => $e['degree'],
                'desc' => $e['desc'],
                'position' => $i,
            ]);
        }
    }

    private function writeExperience(array $rows): void
    {
        Experience::query()->delete();
        foreach (array_values($rows) as $i => $e) {
            $exp = Experience::query()->create([
                'slug' => $e['slug'] ?? $e['id'] ?? ('exp-' . ($i + 1)),
                'date' => $e['date'],
                'role' => $e['role'],
                'company' => $e['company'],
                'position' => $i,
            ]);

            foreach (array_values($e['accomplishments'] ?? []) as $j => $text) {
                ExperienceAccomplishment::query()->create([
                    'experience_id' => $exp->id,
                    'text' => $text,
                    'position' => $j,
                ]);
            }
        }
    }

    private function writeLanguages(array $rows): void
    {
        Language::query()->delete();
        foreach (array_values($rows) as $i => $l) {
            Language::query()->create([
                'name' => $l['name'],
                'stars' => $l['stars'],
                'position' => $i,
            ]);
        }
    }

    private function writeToolkit(array $badges): void
    {
        Toolkit::query()->delete();
        foreach (array_values($badges) as $i => $badge) {
            Toolkit::query()->create([
                'badge' => $badge,
                'position' => $i,
            ]);
        }
    }

    private function writeCertificates(array $rows): void
    {
        Certificate::query()->delete();
        foreach (array_values($rows) as $i => $c) {
            Certificate::query()->create([
                'slug' => $c['slug'] ?? $c['id'] ?? ('cert-' . ($i + 1)),
                'title' => $c['title'],
                'issuer' => $c['issuer'],
                'letter' => $c['letter'],
                'image' => $c['image'] ?? '',
                'validity' => $c['validity'] ?? '',
                'desc' => $c['desc'],
                'position' => $i,
            ]);
        }
    }
}
