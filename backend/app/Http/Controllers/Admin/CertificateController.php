<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\Concerns\GeneratesSlug;
use App\Models\Certificate;
use App\Rules\TranslatableString;
use Illuminate\Http\Request;

class CertificateController extends AdminCrudController
{
    use GeneratesSlug;

    protected function modelClass(): string
    {
        return Certificate::class;
    }

    protected function rules(): array
    {
        return [
            'title' => [new TranslatableString(max: 300)],
            'issuer' => ['required', 'string', 'max:200'],
            'letter' => ['required', 'string', 'max:2'],
            'image' => ['present', 'string', 'max:500'],
            'validity' => [new TranslatableString(max: 200, required: false)],
            'desc' => [new TranslatableString(max: 1000)],
        ];
    }

    public function store(Request $request)
    {
        $validated = $request->validate($this->rules());
        $validated['slug'] = $this->generateUniqueSlug(Certificate::class, $validated['title']['tr'] ?? 'certificate');
        $nextPosition = (int) Certificate::query()->max('position') + 1;

        $record = Certificate::create([...$validated, 'position' => $nextPosition]);

        return response()->json(['success' => true, 'data' => $record], 201);
    }
}
