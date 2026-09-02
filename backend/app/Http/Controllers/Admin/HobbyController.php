<?php

namespace App\Http\Controllers\Admin;

use App\Models\Hobby;
use App\Rules\TranslatableString;

class HobbyController extends AdminCrudController
{
    protected function modelClass(): string
    {
        return Hobby::class;
    }

    protected function rules(): array
    {
        return [
            'icon' => ['required', 'string', 'max:8'],
            'label' => [new TranslatableString(max: 100)],
        ];
    }
}
