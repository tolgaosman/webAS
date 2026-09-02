<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\Concerns\GeneratesSlug;
use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Rules\TranslatableString;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

/**
 * Projects own two nested child collections (images, achievements) that
 * the generic AdminCrudController can't express — both are sent as
 * plain arrays inside the project's own request body and diffed
 * server-side in one transaction, so the drag-to-reorder image strip in
 * the admin panel stays a single atomic save (§Faz 3).
 */
class ProjectController extends Controller
{
    use GeneratesSlug;

    public function index()
    {
        return response()->json([
            'data' => Project::query()
                ->with(['images', 'achievements'])
                ->orderBy('position')
                ->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate($this->rules());

        $record = DB::transaction(function () use ($validated) {
            $nextPosition = (int) Project::query()->max('position') + 1;

            $project = Project::create([
                ...$this->baseFields($validated),
                'slug' => $this->generateUniqueSlug(Project::class, $validated['title']['tr'] ?? 'project'),
                'position' => $nextPosition,
            ]);

            $this->syncChildren($project, $validated);

            return $project->load(['images', 'achievements']);
        });

        return response()->json(['success' => true, 'data' => $record], 201);
    }

    public function update(Request $request, int $id)
    {
        $validated = $request->validate($this->rules());

        $record = DB::transaction(function () use ($validated, $id) {
            $project = Project::query()->findOrFail($id);
            $project->update($this->baseFields($validated));
            $this->syncChildren($project, $validated);

            return $project->load(['images', 'achievements']);
        });

        return response()->json(['success' => true, 'data' => $record]);
    }

    public function destroy(int $id)
    {
        // images/achievements cascade-delete via FK (see
        // 2025_01_01_000004/5 migrations).
        Project::query()->findOrFail($id)->delete();

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
                Project::query()->whereKey($id)->update(['position' => $position]);
            }
        });

        return response()->json(['success' => true]);
    }

    private function rules(): array
    {
        return [
            'title' => [new TranslatableString(max: 200)],
            'category' => [new TranslatableString(max: 100)],
            'thumbnail' => ['present', 'string', 'max:500'],
            'description' => [new TranslatableString(max: 5000)],
            'meta_role' => [new TranslatableString(max: 200, required: false)],
            'meta_client_label' => [new TranslatableString(max: 200, required: false)],
            'meta_client' => [new TranslatableString(max: 200, required: false)],
            'meta_tools' => [new TranslatableString(max: 500, required: false)],
            'meta_category' => [new TranslatableString(max: 200, required: false)],
            'goals' => [new TranslatableString(max: 500, required: false)],
            'images' => ['present', 'array', 'max:20'],
            'images.*' => ['string', 'max:500'],
            'achievements' => ['present', 'array', 'max:20'],
            'achievements.*' => [new TranslatableString(max: 500, required: false)],
        ];
    }

    /** Scalar/translatable columns that belong directly on the projects row. */
    private function baseFields(array $validated): array
    {
        return collect($validated)
            ->except(['images', 'achievements'])
            ->all();
    }

    private function syncChildren(Project $project, array $validated): void
    {
        $project->images()->delete();
        foreach (array_values($validated['images'] ?? []) as $i => $path) {
            $project->images()->create(['path' => $path, 'position' => $i]);
        }

        $project->achievements()->delete();
        foreach (array_values($validated['achievements'] ?? []) as $i => $text) {
            $project->achievements()->create(['text' => $text, 'position' => $i]);
        }
    }
}
