<?php

namespace App\Console\Commands;

use App\Models\CoreSkill;
use App\Services\PortfolioWriter;
use Illuminate\Console\Command;

/**
 * One-off data migration (§Faz 4): imports the legacy, single-language
 * portfolio-data.json into the i18n normalized MySQL schema via
 * PortfolioWriter. Two transforms happen, in order:
 *
 *   1. unescapeDeep() — undoes the legacy double/triple HTML-escaping
 *      bug (legacy/backend/src/utils/sanitize.ts::sanitizeObject ran on
 *      both read AND write, so every save/load cycle added another
 *      escaping layer, e.g. "https:&amp;#x2F;&amp;#x2F;instagram.com").
 *   2. localizeDeep() — wraps every translatable field (§Faz 2) into
 *      {tr: <original value>, en: "", nl: ""} and splits the legacy
 *      comma-separated `images` string into a plain array. This is
 *      PATH-DRIVEN, not type-driven: a blanket "wrap every string"
 *      would also wrap `email`, `thumbnail`, `slug`, `instagram`. The
 *      per-section field lists below are the executable documentation
 *      of the scalar/translatable split — keep them in sync with each
 *      model's $translatable list (see migration plan §Faz 2's
 *      cross-check) whenever a field's translatability changes.
 *
 * Usage:
 *   php artisan portfolio:import ../portfolio-data.json --dry-run
 *   php artisan portfolio:import ../portfolio-data.json
 *
 * After running, verify with the round-trip check described in the
 * migration plan §Faz 4: curl /api/portfolio and confirm instagram
 * reads a clean URL (not &amp;#x2F;) and title comes back as
 * {"tr":"...","en":"","nl":""}.
 */
class ImportPortfolioData extends Command
{
    protected $signature = 'portfolio:import
        {path : Path to the legacy portfolio-data.json file}
        {--dry-run : Parse, unescape, and localize only — do not write to the database}
        {--force : Skip the confirmation prompt when the database is not empty}';

    protected $description = 'Import legacy portfolio-data.json into the i18n MySQL schema, undoing the legacy double-escaping bug and wrapping translatable fields as {tr,en,nl} along the way';

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

        $data = $this->localizeDeep($data);

        if ($this->option('dry-run')) {
            $this->line(json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
            $this->info('Dry run — nothing was written.');

            return self::SUCCESS;
        }

        // Re-running this against a live database silently overwrites
        // any edits made through the admin panel since the last import
        // — the whole dataset is deleted and recreated (see
        // PortfolioWriter::replaceAll()'s docblock). Confirm unless the
        // DB is empty or the operator explicitly passed --force.
        if (! $this->option('force') && CoreSkill::query()->exists()) {
            if (! $this->confirm('The database already has portfolio data. Importing now will PERMANENTLY OVERWRITE it, including any admin panel edits. Continue?')) {
                $this->comment('Aborted.');

                return self::SUCCESS;
            }
        }

        $writer->replaceAll($data);
        $this->info('Import complete.');

        return self::SUCCESS;
    }

    /**
     * Wraps every translatable field as {tr: <value>, en: "", nl: ""}
     * (App\Casts\Translatable accepts a plain string as shorthand for
     * exactly this, but we spell it out here so the dry-run output is
     * self-explanatory) and splits `images` into a plain array. Field
     * lists mirror the tables in migration plan §Faz 2 exactly.
     */
    private function localizeDeep(array $data): array
    {
        $wrap = fn (?string $v) => ['tr' => (string) $v, 'en' => '', 'nl' => ''];
        $wrapList = fn (array $items) => array_map($wrap, array_values($items));

        if (isset($data['personal'])) {
            $data['personal']['cvUrl'] = $wrap($data['personal']['cvUrl'] ?? '');
        }

        foreach ($data['coreSkills'] ?? [] as $i => $s) {
            $data['coreSkills'][$i]['title'] = $wrap($s['title'] ?? '');
            $data['coreSkills'][$i]['desc'] = $wrap($s['desc'] ?? '');
        }

        foreach ($data['projects'] ?? [] as $i => $p) {
            $data['projects'][$i]['slug'] = $p['id'] ?? ('project-' . ($i + 1));
            $data['projects'][$i]['title'] = $wrap($p['title'] ?? '');
            $data['projects'][$i]['category'] = $wrap($p['category'] ?? '');
            $data['projects'][$i]['description'] = $wrap($p['description'] ?? '');
            $data['projects'][$i]['metaRole'] = $wrap($p['metaRole'] ?? '');
            $data['projects'][$i]['metaClientLabel'] = $wrap($p['metaClientLabel'] ?? '');
            $data['projects'][$i]['metaClient'] = $wrap($p['metaClient'] ?? '');
            $data['projects'][$i]['metaTools'] = $wrap($p['metaTools'] ?? '');
            $data['projects'][$i]['metaCategory'] = $wrap($p['metaCategory'] ?? '');
            $data['projects'][$i]['goals'] = $wrap($p['goals'] ?? '');
            $data['projects'][$i]['achievements'] = $wrapList($p['achievements'] ?? []);
            // Legacy `images` is a single comma-separated string — split
            // into the plain array PortfolioWriter now expects.
            $data['projects'][$i]['images'] = array_values(array_filter(
                array_map('trim', explode(',', $p['images'] ?? ''))
            ));
        }

        foreach ($data['education'] ?? [] as $i => $e) {
            $data['education'][$i]['date'] = $wrap($e['date'] ?? '');
            $data['education'][$i]['degree'] = $wrap($e['degree'] ?? '');
            $data['education'][$i]['desc'] = $wrap($e['desc'] ?? '');
        }

        foreach ($data['experience'] ?? [] as $i => $e) {
            $data['experience'][$i]['slug'] = $e['id'] ?? ('exp-' . ($i + 1));
            $data['experience'][$i]['date'] = $wrap($e['date'] ?? '');
            $data['experience'][$i]['role'] = $wrap($e['role'] ?? '');
            $data['experience'][$i]['accomplishments'] = $wrapList($e['accomplishments'] ?? []);
        }

        foreach ($data['languages'] ?? [] as $i => $l) {
            $data['languages'][$i]['name'] = $wrap($l['name'] ?? '');
        }

        $data['toolkit'] = $wrapList($data['toolkit'] ?? []);

        foreach ($data['certificates'] ?? [] as $i => $c) {
            $data['certificates'][$i]['slug'] = $c['id'] ?? ('cert-' . ($i + 1));
            $data['certificates'][$i]['title'] = $wrap($c['title'] ?? '');
            $data['certificates'][$i]['validity'] = $wrap($c['validity'] ?? '');
            $data['certificates'][$i]['desc'] = $wrap($c['desc'] ?? '');
        }

        return $data;
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
