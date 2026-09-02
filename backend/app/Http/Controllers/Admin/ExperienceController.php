<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\Concerns\GeneratesSlug;
use App\Http\Controllers\Controller;
use App\Models\Experience;
use App\Rules\TranslatableString;
use App\Services\PortfolioSerializer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

/**
 * Same pattern as ProjectController — experience entries own a nested
 * `accomplishments` collection sent as a plain array in the request
 * body (§Faz 3).
 */
class ExperienceController extends Controller
{
    use GeneratesSlug;

    public function index()
    {
        return response()->json([
            'data' => Experience::query()
                ->with('accomplishments')
                ->orderBy('position')
                ->get()
                ->map(fn (Experience $e) => PortfolioSerializer::presentExperience($e)),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate($this->rules());

        $record = DB::transaction(function () use ($validated) {
            $nextPosition = (int) Experience::query()->max('position') + 1;

            $experience = Experience::create([
                ...$this->baseFields($validated),
                'slug' => $this->generateUniqueSlug(Experience::class, ($validated['role']['tr'] ?? 'experience')),
                'position' => $nextPosition,
            ]);

            $this->syncChildren($experience, $validated);

            return $experience->load('accomplishments');
        });

        return response()->json(['success' => true, 'data' => PortfolioSerializer::presentExperience($record)], 201);
    }

    public function update(Request $request, int $id)
    {
        $validated = $request->validate($this->rules());

        $record = DB::transaction(function () use ($validated, $id) {
            $experience = Experience::query()->findOrFail($id);
            $experience->update($this->baseFields($validated));
            $this->syncChildren($experience, $validated);

            return $experience->load('accomplishments');
        });

        return response()->json(['success' => true, 'data' => PortfolioSerializer::presentExperience($record)]);
    }

    public function destroy(int $id)
    {
        // accomplishments cascade-delete via FK (see
        // 2025_01_01_000008 migration).
        Experience::query()->findOrFail($id)->delete();

        return response()->json(['success' => true]);
    }

    public function reorder(Request $request)
    {
        $validated = $request->validate([
            'ids' => ['required', 'array', 'min:1'],
            'ids.*' => ['integer'],
        ]);

        DB::transaction(function () use ($validated) {
            foreach ($validated['ids'] as $position => $id) {
                Experience::query()->whereKey($id)->update(['position' => $position]);
            }
        });

        return response()->json(['success' => true]);
    }

    private function rules(): array
    {
        return [
            'date' => [new TranslatableString(max: 100)],
            'role' => [new TranslatableString(max: 200)],
            'company' => ['required', 'string', 'max:200'],
            'accomplishments' => ['required', 'array', 'max:20'],
            'accomplishments.*' => [new TranslatableString(max: 500)],
        ];
    }

    private function baseFields(array $validated): array
    {
        return collect($validated)->except(['accomplishments'])->all();
    }

    private function syncChildren(Experience $experience, array $validated): void
    {
        $experience->accomplishments()->delete();
        foreach (array_values($validated['accomplishments'] ?? []) as $i => $text) {
            $experience->accomplishments()->create(['text' => $text, 'position' => $i]);
        }
    }
}
