<?php

namespace App\Http\Requests\Concerns;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

/**
 * Overrides Laravel's default 422 {message, errors} validation-failure
 * shape with the legacy Express/Zod shape (see
 * legacy/backend/src/middleware/validate.ts), which the frontend admin
 * panel does not currently parse but which must stay byte-compatible
 * for anything that does (migration plan §Faz 4):
 *
 *   400 {
 *     "error": "Doğrulama hatası. Lütfen girişlerinizi kontrol edin.",
 *     "details": [{ "field": "...", "message": "..." }]
 *   }
 */
trait FailsWithLegacyShape
{
    protected function failedValidation(Validator $validator): void
    {
        $details = [];
        foreach ($validator->errors()->messages() as $field => $messages) {
            $details[] = [
                'field' => $field,
                'message' => $messages[0] ?? '',
            ];
        }

        throw new HttpResponseException(response()->json([
            'error' => 'Doğrulama hatası. Lütfen girişlerinizi kontrol edin.',
            'details' => $details,
        ], 400));
    }
}
