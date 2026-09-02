<?php

namespace App\Http\Controllers;

use App\Services\PortfolioSerializer;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

/**
 * Public read + upload endpoints (§Faz 3). The old whole-object
 * PUT /api/portfolio handler was replaced by the per-resource admin
 * controllers under App\Http\Controllers\Admin\* — see PortfolioWriter's
 * docblock for why (churns every primary key on every save, one bad
 * field anywhere rejects the entire dataset once every field is
 * {tr,en,nl}).
 *
 * NOTE on JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES: without these
 * flags Laravel's default json() would emit \u-escaped Turkish
 * characters and escape "/" as "\/".
 */
class PortfolioController extends Controller
{
    private const JSON_FLAGS = JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES;

    private const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

    private const MAX_UPLOAD_BYTES = 8 * 1024 * 1024; // 8MB, matches legacy multer limit

    public function index(PortfolioSerializer $serializer)
    {
        try {
            $data = $serializer->toArray();

            return response()->json($data, 200, [], self::JSON_FLAGS);
        } catch (\Throwable $e) {
            report($e);

            return response()->json(['error' => 'Veri alınırken hata oluştu.'], 500);
        }
    }

    public function uploadImage(Request $request)
    {
        $request->validate([
            'file' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:8192',
        ]);

        $file = $request->file('file');

        // Laravel's hashName() securely generates a unique, safe filename
        // and automatically applies the correct extension based on magic bytes.
        $filename = $file->hashName();

        // Write directly at the public_uploads disk root (empty path
        // prefix), NOT under a nested "uploads/" subdirectory.
        $file->storeAs('', $filename, 'public_uploads');

        return response()->json(['url' => "/assets/uploads/{$filename}"], 200, [], self::JSON_FLAGS);
    }
}
