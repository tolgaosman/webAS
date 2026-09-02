<?php

namespace App\Http\Controllers\Admin;

use App\Models\BioParagraph;
use App\Rules\TranslatableString;

class BioParagraphController extends AdminCrudController
{
    protected function modelClass(): string
    {
        return BioParagraph::class;
    }

    protected function rules(): array
    {
        return [
            'body' => [new TranslatableString(max: 2000)],
        ];
    }
}
