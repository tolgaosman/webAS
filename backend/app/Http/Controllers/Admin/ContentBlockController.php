<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContentBlock;
use App\Rules\TranslatableString;
use Illuminate\Http\Request;

/**
 * Bulk key->value map rather than per-key REST (§Faz 3) — the Section
 * Headings admin panel edits ~12 keys on one screen and per-key PUTs
 * would fire a dozen requests. Keys are seeded by
 * database/seeders/StaticContentSeeder.php and never created/deleted by
 * the admin, so there's no store()/destroy().
 */
class ContentBlockController extends Controller
{
    public function index()
    {
        $blocks = ContentBlock::query()->get()->keyBy('key')->map(fn (ContentBlock $b) => [
            'group' => $b->group,
            'kind' => $b->kind,
            'value' => $b->value,
        ]);

        return response()->json($blocks);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'blocks' => ['required', 'array', 'min:1'],
        ]);

        $rule = new TranslatableString(max: 5000, required: false);
        $updated = 0;

        foreach ($validated['blocks'] as $key => $value) {
            $fail = null;
            $rule->validate("blocks.{$key}", $value, function (string $message) use (&$fail) {
                $fail = $message;
            });
            if ($fail !== null) {
                return response()->json([
                    'error' => 'Doğrulama hatası. Lütfen girişlerinizi kontrol edin.',
                    'details' => [['field' => "blocks.{$key}", 'message' => $fail]],
                ], 400);
            }

            $block = ContentBlock::query()->where('key', $key)->first();
            if (! $block) {
                continue; // unknown keys are silently ignored — this panel only edits seeded keys
            }

            $block->update(['value' => $value]);
            $updated++;
        }

        return response()->json(['success' => true, 'updated' => $updated]);
    }
}
