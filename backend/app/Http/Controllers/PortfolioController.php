<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdatePortfolioRequest;
use App\Services\PortfolioSerializer;
use App\Services\PortfolioWriter;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

/**
 * Byte-compatible port of
 * legacy/backend/src/controllers/data.controller.ts. Response shapes,
 * status codes and Turkish messages are unchanged (see migration plan
 * §Faz 4 and §Faz 6).
 *
 * NOTE on JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES: without these
 * flags Laravel's default json() would emit ü for Turkish characters
 * and escape "/" as "\/", both byte-level differences from the legacy
 * Express API (Express's res.json() does neither by default).
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

    public function update(UpdatePortfolioRequest $request, PortfolioWriter $writer)
    {
        try {
            $writer->replaceAll($request->validated());

            return response()->json([
                'success' => true,
                'message' => 'Portfolyo verisi başarıyla güncellendi.',
            ], 200, [], self::JSON_FLAGS);
        } catch (\Throwable $e) {
            report($e);

            return response()->json(['error' => 'Veri güncellenirken hata oluştu.'], 500);
        }
    }

    public function uploadImage(Request $request)
    {
        $file = $request->file('file');

        if (! $file) {
            return response()->json(['error' => 'Dosya bulunamadı.'], 400);
        }

        if ($file->getSize() > self::MAX_UPLOAD_BYTES) {
            return response()->json(['error' => 'Yükleme hatası.'], 400);
        }

        // Client-declared mime, matching legacy behavior exactly (no magic-byte sniffing).
        if (! in_array($file->getClientMimeType(), self::ALLOWED_MIME_TYPES, true)) {
            return response()->json(['error' => 'Yalnızca JPEG, PNG, WEBP veya GIF görselleri yüklenebilir.'], 400);
        }

        // Filename scheme matches legacy/backend/src/middleware/upload.ts exactly:
        // {safeBase}-{12 hex chars}{ext}
        $originalName = $file->getClientOriginalName();
        $ext = strtolower($file->getClientOriginalExtension());
        $base = pathinfo($originalName, PATHINFO_FILENAME);
        $safeBase = Str::substr(preg_replace('/[^a-zA-Z0-9_-]/', '_', $base) ?: 'image', 0, 60);
        $suffix = bin2hex(random_bytes(6));
        $filename = "{$safeBase}-{$suffix}." . $ext;

        // Write directly at the public_uploads disk root (empty path
        // prefix), NOT under a nested "uploads/" subdirectory — the disk
        // root (config/filesystems.php) already points at the uploads
        // directory nginx serves as /assets/uploads (see migration plan
        // §Faz 8). storeAs('uploads', ...) here would double the path
        // segment and 404 every upload.
        $file->storeAs('', $filename, 'public_uploads');

        return response()->json(['url' => "/assets/uploads/{$filename}"], 200, [], self::JSON_FLAGS);
    }
}
