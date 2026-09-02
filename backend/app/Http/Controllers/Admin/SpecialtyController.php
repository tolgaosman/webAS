<?php

namespace App\Http\Controllers\Admin;

use App\Models\Specialty;
use App\Rules\TranslatableString;

class SpecialtyController extends AdminCrudController
{
    protected function modelClass(): string
    {
        return Specialty::class;
    }

    protected function rules(): array
    {
        return [
            'image' => ['present', 'string', 'max:500'],
            'title' => [new TranslatableString(max: 200)],
            'desc' => [new TranslatableString(max: 1000)],
            'cta_label' => [new TranslatableString(max: 100)],
            'cta_href' => ['required', 'string', 'max:100'],
        ];
    }
}
