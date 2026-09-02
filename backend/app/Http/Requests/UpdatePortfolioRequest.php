<?php

namespace App\Http\Requests;

use App\Http\Requests\Concerns\FailsWithLegacyShape;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

/**
 * Mirrors legacy/backend/src/schemas/portfolio.schema.ts::PortfolioDataSchema
 * field-for-field (see migration plan §Faz 4). A few Zod fields are
 * `.optional().default("")` / `.default([])` — those become "present but
 * nullable" here, and prepareForValidation() fills the same defaults
 * Zod's `.parse()` would have, so PortfolioWriter always receives a
 * fully-populated object either way.
 */
class UpdatePortfolioRequest extends FormRequest
{
    use FailsWithLegacyShape;

    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $projects = $this->input('projects', []);
        foreach ($projects as $i => $p) {
            $projects[$i]['metaRole'] = $p['metaRole'] ?? '';
            $projects[$i]['metaClientLabel'] = $p['metaClientLabel'] ?? '';
            $projects[$i]['metaClient'] = $p['metaClient'] ?? '';
            $projects[$i]['metaTools'] = $p['metaTools'] ?? '';
            $projects[$i]['metaCategory'] = $p['metaCategory'] ?? '';
            $projects[$i]['goals'] = $p['goals'] ?? '';
            $projects[$i]['achievements'] = $p['achievements'] ?? [];
        }

        $this->merge(['projects' => $projects]);
    }

    public function rules(): array
    {
        return [
            'personal' => ['required', 'array'],
            'personal.name' => ['required', 'string', 'min:1', 'max:100'],
            'personal.email' => ['required', 'email', 'max:254'],
            'personal.phone' => ['present', 'string', 'max:20', 'regex:/^[+\d\s()-]*$/'],
            'personal.instagram' => ['present', 'string', 'max:500'],
            'personal.linkedin' => ['present', 'string', 'max:500'],
            'personal.cvUrl' => ['present', 'string', 'max:500'],
            'personal.profileImage' => ['present', 'string', 'max:500'],

            'coreSkills' => ['required', 'array', 'max:20'],
            'coreSkills.*.title' => ['required', 'string', 'min:1', 'max:100'],
            'coreSkills.*.desc' => ['required', 'string', 'min:1', 'max:500'],

            'projects' => ['required', 'array', 'max:50'],
            'projects.*.id' => ['required', 'string', 'min:1', 'max:50'],
            'projects.*.title' => ['required', 'string', 'min:1', 'max:200'],
            'projects.*.category' => ['required', 'string', 'min:1', 'max:100'],
            'projects.*.thumbnail' => ['present', 'string', 'max:500'],
            'projects.*.images' => ['present', 'string', 'max:2000'],
            'projects.*.description' => ['required', 'string', 'min:1', 'max:5000'],
            'projects.*.metaRole' => ['nullable', 'string', 'max:200'],
            'projects.*.metaClientLabel' => ['nullable', 'string', 'max:200'],
            'projects.*.metaClient' => ['nullable', 'string', 'max:200'],
            'projects.*.metaTools' => ['nullable', 'string', 'max:500'],
            'projects.*.metaCategory' => ['nullable', 'string', 'max:200'],
            'projects.*.goals' => ['nullable', 'string', 'max:500'],
            'projects.*.achievements' => ['nullable', 'array', 'max:20'],
            'projects.*.achievements.*' => ['string', 'max:500'],

            'education' => ['required', 'array', 'max:20'],
            'education.*.date' => ['required', 'string', 'min:1', 'max:100'],
            'education.*.school' => ['required', 'string', 'min:1', 'max:200'],
            'education.*.degree' => ['required', 'string', 'min:1', 'max:200'],
            'education.*.desc' => ['required', 'string', 'min:1', 'max:1000'],

            'experience' => ['required', 'array', 'max:20'],
            'experience.*.id' => ['required', 'string', 'min:1', 'max:50'],
            'experience.*.date' => ['required', 'string', 'min:1', 'max:100'],
            'experience.*.role' => ['required', 'string', 'min:1', 'max:200'],
            'experience.*.company' => ['required', 'string', 'min:1', 'max:200'],
            'experience.*.accomplishments' => ['required', 'array', 'max:20'],
            'experience.*.accomplishments.*' => ['required', 'string', 'max:500'],

            'languages' => ['required', 'array', 'max:10'],
            'languages.*.name' => ['required', 'string', 'min:1', 'max:100'],
            'languages.*.stars' => ['required', 'integer', 'min:1', 'max:5'],

            'toolkit' => ['required', 'array', 'max:30'],
            'toolkit.*' => ['string', 'max:100'],

            'certificates' => ['required', 'array', 'max:30'],
            'certificates.*.id' => ['required', 'string', 'min:1', 'max:50'],
            'certificates.*.title' => ['required', 'string', 'min:1', 'max:300'],
            'certificates.*.issuer' => ['required', 'string', 'min:1', 'max:200'],
            'certificates.*.letter' => ['required', 'string', 'min:1', 'max:2'],
            'certificates.*.image' => ['present', 'string', 'max:500'],
            'certificates.*.validity' => ['present', 'string', 'max:200'],
            'certificates.*.desc' => ['required', 'string', 'min:1', 'max:1000'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        // Zod: instagram/linkedin are `url().or(literal(""))` — a valid
        // absolute URL, or exactly empty string. Laravel has no built-in
        // "url or empty" rule, hence this closure.
        $validator->after(function (Validator $v) {
            foreach (['instagram', 'linkedin'] as $field) {
                $value = $this->input("personal.{$field}", '');
                if ($value !== '' && filter_var($value, FILTER_VALIDATE_URL) === false) {
                    $v->errors()->add("personal.{$field}", 'Geçerli bir URL girin veya boş bırakın.');
                }
            }
        });
    }
}
