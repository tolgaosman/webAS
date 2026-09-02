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
        return response()->json(['data' => Personal::query()->firstOrFail()]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'email' => ['required', 'email', 'max:254'],
            'phone' => ['present', 'string', 'max:20', 'regex:/^[+\d\s()-]*$/'],
            'instagram' => ['present', 'string', 'max:500'],
            'linkedin' => ['present', 'string', 'max:500'],
            'cv_url' => [new TranslatableString(max: 500, required: false)],
            'profile_image' => ['present', 'string', 'max:500'],
        ]);

        $record = Personal::query()->firstOrFail();
        $record->update($validated);

        return response()->json(['success' => true, 'data' => $record]);
    }
}
