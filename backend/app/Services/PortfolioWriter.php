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
 * Replaces the entire portfolio dataset from a legacy-shaped array
 * (the same shape PortfolioSerializer produces / UpdatePortfolioRequest
 * validates). Mirrors the legacy PUT /api/portfolio semantics — "replace
 * the whole object" — but does it inside one DB transaction so a failed
 * write can no longer leave the site half-updated the way the old
 * fs.writeFileSync(JSON) approach could (see migration plan §Faz 4).
 *
 * Used by both PortfolioController::update() and the one-off
 * `portfolio:import` artisan command (see §Faz 7).
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
                'slug' => $p['id'],
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

            // Legacy images field is a single comma-separated string.
            $paths = array_values(array_filter(array_map('trim', explode(',', $p['images'] ?? ''))));
            foreach ($paths as $j => $path) {
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
                'slug' => $e['id'],
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
                'slug' => $c['id'],
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
