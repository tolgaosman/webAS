<?php

namespace App\Console\Commands;

use App\Services\PortfolioWriter;
use Illuminate\Console\Command;

/**
 * One-off data migration (§Faz 7): imports the legacy portfolio-data.json
 * into the normalized MySQL tables via PortfolioWriter, after undoing the
 * legacy double/triple HTML-escaping bug
 * (legacy/backend/src/utils/sanitize.ts::sanitizeObject ran on both read
 * AND write, so every save/load cycle added another escaping layer —
 * e.g. "https:&amp;#x2F;&amp;#x2F;instagram.com").
 *
 * Usage:
 *   php artisan portfolio:import ../portfolio-data.json
 *   php artisan portfolio:import ../portfolio-data.json --dry-run
 *
 * After running, verify with the round-trip diff described in the
 * migration plan §Faz 7:
 *   curl -s localhost/api/portfolio | jq -S . > golden-after.json
 *   diff <(jq -S . golden-before-unescaped.json) golden-after.json   # must be empty
 */
class ImportPortfolioData extends Command
{
    protected $signature = 'portfolio:import {path : Path to the legacy portfolio-data.json file} {--dry-run : Parse and unescape only, do not write to the database}';

    protected $description = 'Import legacy portfolio-data.json into the normalized MySQL tables, undoing the legacy double-escaping bug along the way';

    /** Highest number of unescape passes observed across all string fields, for the summary log. */
    private int $maxPassesSeen = 0;

    public function handle(PortfolioWriter $writer): int
    {
        $path = $this->argument('path');

        if (! is_file($path)) {
            $this->error("File not found: {$path}");

            return self::FAILURE;
        }

        $raw = file_get_contents($path);
        $data = json_decode($raw, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            $this->error('Invalid JSON: ' . json_last_error_msg());

            return self::FAILURE;
        }

        $data = $this->unescapeDeep($data);

        $this->info("Unescape complete. Deepest escaping layer found: {$this->maxPassesSeen} pass(es).");
        if ($this->maxPassesSeen > 3) {
            $this->warn('More than 3 escaping layers found on at least one field — double-check that field for data corruption, not just double-escaping.');
        }

        if ($this->option('dry-run')) {
            $this->line(json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
            $this->info('Dry run — nothing was written.');

            return self::SUCCESS;
        }

        $writer->replaceAll($data);
        $this->info('Import complete.');

        return self::SUCCESS;
    }

    /**
     * Recursively unescapes every string in the structure, repeating the
     * single-pass unescape until it stops changing (i.e. until every
     * layer the legacy sanitizeObject() added has been peeled off).
     */
    private function unescapeDeep(mixed $value): mixed
    {
        if (is_string($value)) {
            $passes = 0;
            $current = $value;
            while (true) {
                $next = $this->unescapeOnce($current);
                if ($next === $current) {
                    break;
                }
                $current = $next;
                $passes++;
                if ($passes > 10) {
                    // Safety valve — legacy escaping should never nest this deep.
                    break;
                }
            }
            $this->maxPassesSeen = max($this->maxPassesSeen, $passes);

            return $current;
        }

        if (is_array($value)) {
            return array_map(fn ($v) => $this->unescapeDeep($v), $value);
        }

        return $value;
    }

    /**
     * Exact reverse of legacy/backend/src/utils/sanitize.ts::escapeHtml,
     * one layer at a time: &amp; &lt; &gt; &quot; &#x27; &#x2F; &#96;
     * back to & < > " ' / `. All seven tokens are decoded in a single
     * regex pass so this function is the precise inverse of one
     * escapeHtml() call (see docblock above for why repeated calls
     * compound rather than interfere).
     */
    private function unescapeOnce(string $s): string
    {
        return preg_replace_callback(
            '/&amp;|&lt;|&gt;|&quot;|&#x27;|&#x2F;|&#96;/',
            function (array $m): string {
                return match ($m[0]) {
                    '&amp;' => '&',
                    '&lt;' => '<',
                    '&gt;' => '>',
                    '&quot;' => '"',
                    '&#x27;' => "'",
                    '&#x2F;' => '/',
                    '&#96;' => '`',
                };
            },
            $s
        );
    }
}
