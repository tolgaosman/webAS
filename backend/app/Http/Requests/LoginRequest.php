<?php

namespace App\Http\Requests;

use App\Http\Requests\Concerns\FailsWithLegacyShape;
use Illuminate\Foundation\Http\FormRequest;

/**
 * Mirrors legacy/backend/src/schemas/portfolio.schema.ts::LoginSchema.
 */
class LoginRequest extends FormRequest
{
    use FailsWithLegacyShape;

    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'email' => ['required', 'email', 'max:254'],
            'password' => ['required', 'string', 'min:6', 'max:128'],
        ];
    }
}
