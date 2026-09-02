<?php

namespace App\Http\Controllers\Admin;

use App\Models\CoreSkill;
use App\Rules\TranslatableString;

class CoreSkillController extends AdminCrudController
{
    protected function modelClass(): string
    {
        return CoreSkill::class;
    }

    protected function rules(): array
    {
        return [
            'title' => [new TranslatableString(max: 100)],
            'desc' => [new TranslatableString(max: 500)],
        ];
    }
}
