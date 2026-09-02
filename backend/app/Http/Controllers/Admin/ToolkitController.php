<?php

namespace App\Http\Controllers\Admin;

use App\Models\Toolkit;
use App\Rules\TranslatableString;

class ToolkitController extends AdminCrudController
{
    protected function modelClass(): string
    {
        return Toolkit::class;
    }

    protected function rules(): array
    {
        return [
            'badge' => [new TranslatableString(max: 100)],
        ];
    }
}
