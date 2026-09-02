<?php

namespace App\Services;

use App\Models\Certificate;
use App\Models\CoreSkill;
use App\Models\Education;
use App\Models\Experience;
use App\Models\Language;
use App\Models\Personal;
use App\Models\Project;
use App\Models\Toolkit;

/**
 * Assembles the public GET /api/portfolio payload (§Faz 3). Every
 * translatable field is a TranslatedText instance, which implements
 * JsonSerializable (see app/Support/TranslatedText.php) — json_encode()
 * automatically expands it to {tr,en,nl}, so this class never needs to
 * touch escaping/locale-resolution itself; the frontend resolves the
 * active locale client-side (see migration plan §Faz 2 for why).
 *
 * `id` is now the real Eloquent primary key (not the legacy "project-1"
 * string slug) — the frontend contract is being rewritten from scratch
 * alongside this API, so there is no byte-compatibility constraint left
 * to preserve here. `slug` still exists in the database purely as an
 * import/traceability artifact (see
 * app/Http/Controllers/Admin/Concerns/GeneratesSlug.php) and is not
 * part of this response.
 *
 * `images` is a real array now, not the legacy comma-separated string —
 * the database already stores it as ordered rows (project_images).
 */
class PortfolioSerializer
{
    public function toArray(): array
    {
        return [
            'personal' => $this->personal(),
            'coreSkills' => $this->coreSkills(),
            'projects' => $this->projects(),
            'education' => $this->education(),
            'experience' => $this->experience(),
            'languages' => $this->languages(),
            'toolkit' => $this->toolkit(),
            'certificates' => $this->certificates(),
        ];
    }

    private function personal(): array
    {
        // Always exactly one row (id=1) — see 2025_01_01_000001_create_personal_table.php
        $p = Personal::query()->first();

        return [
            'name' => $p?->name ?? '',
            'email' => $p?->email ?? '',
            'phone' => $p?->phone ?? '',
            'instagram' => $p?->instagram ?? '',
            'linkedin' => $p?->linkedin ?? '',
            'cvUrl' => $p?->cv_url,
            'profileImage' => $p?->profile_image ?? '',
        ];
    }

    private function coreSkills(): array
    {
        return CoreSkill::query()
            ->orderBy('position')
            ->get()
            ->map(fn (CoreSkill $s) => [
                'id' => $s->id,
                'title' => $s->title,
                'desc' => $s->desc,
            ])
            ->all();
    }

    private function projects(): array
    {
        return Project::query()
            ->with(['images', 'achievements'])
            ->orderBy('position')
            ->get()
            ->map(fn (Project $proj) => [
                'id' => $proj->id,
                'title' => $proj->title,
                'category' => $proj->category,
                'thumbnail' => $proj->thumbnail,
                'images' => $proj->images->pluck('path')->values()->all(),
                'description' => $proj->description,
                'metaRole' => $proj->meta_role,
                'metaClientLabel' => $proj->meta_client_label,
                'metaClient' => $proj->meta_client,
                'metaTools' => $proj->meta_tools,
                'metaCategory' => $proj->meta_category,
                'goals' => $proj->goals,
                'achievements' => $proj->achievements->pluck('text')->values()->all(),
            ])
            ->all();
    }

    private function education(): array
    {
        return Education::query()
            ->orderBy('position')
            ->get()
            ->map(fn (Education $e) => [
                'id' => $e->id,
                'date' => $e->date,
                'school' => $e->school,
                'degree' => $e->degree,
                'desc' => $e->desc,
            ])
            ->all();
    }

    private function experience(): array
    {
        return Experience::query()
            ->with('accomplishments')
            ->orderBy('position')
            ->get()
            ->map(fn (Experience $exp) => [
                'id' => $exp->id,
                'date' => $exp->date,
                'role' => $exp->role,
                'company' => $exp->company,
                'accomplishments' => $exp->accomplishments->pluck('text')->values()->all(),
            ])
            ->all();
    }

    private function languages(): array
    {
        return Language::query()
            ->orderBy('position')
            ->get()
            ->map(fn (Language $l) => [
                'id' => $l->id,
                'name' => $l->name,
                'stars' => (int) $l->stars,
            ])
            ->all();
    }

    private function toolkit(): array
    {
        return Toolkit::query()
            ->orderBy('position')
            ->get()
            ->map(fn (Toolkit $t) => [
                'id' => $t->id,
                'badge' => $t->badge,
            ])
            ->all();
    }

    private function certificates(): array
    {
        return Certificate::query()
            ->orderBy('position')
            ->get()
            ->map(fn (Certificate $c) => [
                'id' => $c->id,
                'title' => $c->title,
                'issuer' => $c->issuer,
                'letter' => $c->letter,
                'image' => $c->image,
                'validity' => $c->validity,
                'desc' => $c->desc,
            ])
            ->all();
    }
}
