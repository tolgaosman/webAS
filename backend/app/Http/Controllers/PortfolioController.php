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

        try {
            // Write directly at the public_uploads disk root (empty path
            // prefix), NOT under a nested "uploads/" subdirectory.
            $file->storeAs('', $filename, 'public_uploads');
        } catch (\Throwable $e) {
            report($e);

            // filesystems.php's public_uploads disk has 'throw' => true,
            // so a permission/missing-directory problem on the server
            // surfaces here as an exception instead of storeAs() quietly
            // returning false — without this catch it fell through to
            // bootstrap/app.php's generic handler and the admin panel
            // only ever saw "Sunucu hatası oluştu.", with no way to tell
            // a permissions problem apart from anything else. See
            // deploy.sh's uploads chown step for the actual fix.
            return response()->json([
                'error' => 'Görsel kaydedilemedi — sunucu yükleme klasörüne yazamıyor.',
            ], 500);
        }

        return response()->json(['url' => "/assets/uploads/{$filename}"], 200, [], self::JSON_FLAGS);
    }
}
