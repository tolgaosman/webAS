<?php

namespace App\Http\Controllers\Admin;

use App\Models\Language;
use App\Rules\TranslatableString;

class LanguageController extends AdminCrudController
{
    protected function modelClass(): string
    {
        return Language::class;
    }

    protected function rules(): array
    {
        return [
            'name' => [new TranslatableString(max: 100)],
            'stars' => ['required', 'integer', 'min:1', 'max:5'],
        ];
    }
}
