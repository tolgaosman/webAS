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
 * Reassembles the normalized tables into the exact legacy JSON shape that
 * the Express backend produced. This is the byte-compatibility layer the
 * migration plan (§Faz 4) calls the most critical piece — the frontend
 * (see frontend/src/types/portfolio.ts) is written against this exact
 * shape and must not need to change.
 *
 * Deliberately returns a plain nested array (not an Eloquent JsonResource)
 * so key order and shape are fully explicit here rather than implied by
 * model attribute order.
 *
 * IMPORTANT: whoever calls toArray() must render it with
 * `response()->json($data, 200, [], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES)`
 * — without those flags Turkish characters get \uXXXX-escaped and "/"
 * becomes "\/", which is a byte-level difference from the legacy API
 * (see PortfolioController).
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
            'cvUrl' => $p?->cv_url ?? '',
            'profileImage' => $p?->profile_image ?? '',
        ];
    }

    private function coreSkills(): array
    {
        return CoreSkill::query()
            ->orderBy('position')
            ->get()
            ->map(fn (CoreSkill $s) => [
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
                'id' => $proj->slug,
                'title' => $proj->title,
                'category' => $proj->category,
                'thumbnail' => $proj->thumbnail,
                // Rejoin normalized rows into the legacy comma-separated string.
                'images' => $proj->images->pluck('path')->implode(', '),
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
                'id' => $exp->slug,
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
            ->pluck('badge')
            ->values()
            ->all();
    }

    private function certificates(): array
    {
        return Certificate::query()
            ->orderBy('position')
            ->get()
            ->map(fn (Certificate $c) => [
                'id' => $c->slug,
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
