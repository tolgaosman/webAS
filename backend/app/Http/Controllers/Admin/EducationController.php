<?php

namespace App\Http\Controllers\Admin;

use App\Models\Education;
use App\Rules\TranslatableString;

class EducationController extends AdminCrudController
{
    protected function modelClass(): string
    {
        return Education::class;
    }

    protected function rules(): array
    {
        return [
            'date' => [new TranslatableString(max: 100)],
            'school' => ['required', 'string', 'max:200'],
            'degree' => [new TranslatableString(max: 200)],
            'desc' => [new TranslatableString(max: 1000)],
        ];
    }
}
