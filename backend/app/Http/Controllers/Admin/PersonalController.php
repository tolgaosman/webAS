<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Personal;
use App\Rules\TranslatableString;
use Illuminate\Http\Request;

/**
 * Singleton resource — always exactly one row (id=1, see
 * 2025_01_01_000001_create_personal_table migration).
 */
class PersonalController extends Controller
{
    public function show()
    {
        $record = Personal::query()->first();
        
        if (! $record) {
            // Provide a default empty record if the table is freshly migrated
            // without data, so the frontend form still loads.
            $record = new Personal([
                'id' => 1,
                'name' => '',
                'email' => '',
                'phone' => '',
                'instagram' => '',
                'linkedin' => '',
                'cv_url' => ['tr' => '', 'en' => '', 'nl' => ''],
                'profile_image' => '',
            ]);
        }

        return response()->json(['data' => $record]);
    }

    public function update(Request $request)
    {
        // A closure rule rather than the built-in 'url' rule: the field
        // must stay optional (empty string is how the public site is told
        // to hide the Instagram/LinkedIn button — see
        // ContactChannels.tsx/Hero.tsx), and Laravel's 'nullable' rule
        // does not treat "" as null here (no ConvertEmptyStringsToNull
        // middleware is registered in bootstrap/app.php). Only a
        // non-empty value is required to actually be a URL. Legacy's Zod
        // schema had this (legacy/backend/src/schemas/portfolio.schema.ts)
        // but it was dropped in the Laravel rewrite.
        $urlIfPresent = function (string $attribute, mixed $value, \Closure $fail): void {
            if ($value !== '' && ! filter_var($value, FILTER_VALIDATE_URL)) {
                $fail("The {$attribute} field must be a valid URL.");
            }
        };

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'email' => ['required', 'email', 'max:254'],
            'phone' => ['present', 'string', 'max:20', 'regex:/^[+\d\s()-]*$/'],
            'instagram' => ['present', 'string', 'max:500', $urlIfPresent],
            'linkedin' => ['present', 'string', 'max:500', $urlIfPresent],
            'cv_url' => [new TranslatableString(max: 500, required: false)],
            'profile_image' => ['present', 'string', 'max:500'],
        ]);

        $record = Personal::query()->first();
        if (! $record) {
            $record = new Personal();
            $record->id = 1;
        }
        
        $record->fill($validated);
        $record->save();

        return response()->json(['success' => true, 'data' => $record]);
    }
}
