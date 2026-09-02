<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

/**
 * Shared list/create/update/delete/reorder behavior for the simple
 * portfolio collections — core skills, education, languages, toolkit,
 * certificates, bio paragraphs, hobbies, specialties (§Faz 3). Every
 * concrete controller here just supplies a model class and a validation
 * rule set; Project and Experience need their own controllers instead
 * because they own nested child collections (images/achievements,
 * accomplishments) that a generic CRUD loop can't express.
 *
 * All mutating actions run inside `auth.jwt` + `throttle:api` (see
 * routes/api.php) — this class assumes that's already enforced by the
 * route, not by itself.
 */
abstract class AdminCrudController extends Controller
{
    /** @return class-string<Model> */
    abstract protected function modelClass(): string;

    /** @return array<string, array<int, mixed>> Laravel validation rules, keyed by field. */
    abstract protected function rules(): array;

    public function index()
    {
        $model = $this->modelClass();

        return response()->json([
            'data' => $model::query()->orderBy('position')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate($this->rules());
        $model = $this->modelClass();

        $nextPosition = (int) $model::query()->max('position') + 1;
        $record = $model::create([...$validated, 'position' => $nextPosition]);

        return response()->json(['success' => true, 'data' => $record], 201);
    }

    public function update(Request $request, int $id)
    {
        $validated = $request->validate($this->rules());
        $model = $this->modelClass();

        $record = $model::query()->findOrFail($id);
        $record->update($validated);

        return response()->json(['success' => true, 'data' => $record]);
    }

    public function destroy(int $id)
    {
        $model = $this->modelClass();
        $model::query()->findOrFail($id)->delete();

        return response()->json(['success' => true]);
    }

    /**
     * POST /api/admin/{resource}/reorder — {ids:[3,1,2]} rewrites
     * `position` to match the given order (index in the array = new
     * position). Every id must already belong to this resource.
     */
    public function reorder(Request $request)
    {
        $validated = $request->validate([
            'ids' => ['required', 'array', 'min:1'],
            'ids.*' => ['integer'],
        ]);
        $model = $this->modelClass();

        DB::transaction(function () use ($validated, $model) {
            foreach ($validated['ids'] as $position => $id) {
                $model::query()->whereKey($id)->update(['position' => $position]);
            }
        });

        return response()->json(['success' => true]);
    }
}
