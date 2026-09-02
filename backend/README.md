# backend/ — webAS Laravel API

Full Laravel 11 application (see migration plan §Faz 1-4 at
`C:\Users\Osman\.claude\plans\sen-daha-ok-ilerlemeden-bright-yao.md` for
the complete rationale). Every skeleton file is committed — this
directory only needs `composer install` to become runnable, unlike the
`api/` overlay it replaced (which required scaffolding a fresh
`laravel new` project and manually merging files in).

## Setup

```bash
composer install          # writes composer.lock — commit it afterwards
cp .env.example .env
php artisan key:generate
# fill in: DB_PASSWORD, JWT_SECRET (fresh value, ≥32 chars — see .env.example),
#          ADMIN_EMAIL, ADMIN_PASSWORD, ALLOWED_ORIGINS, UPLOADS_PATH
php artisan migrate
php artisan db:seed
```

## Import the legacy portfolio data (§Faz 4)

```bash
php artisan portfolio:import ../portfolio-data.json --dry-run   # inspect first
php artisan portfolio:import ../portfolio-data.json
```

Never run this a second time against a non-empty database — it will
prompt for confirmation and, if confirmed, overwrite any edits made
through the admin panel since the last import.

## Run it

```bash
php artisan serve   # local dev, http://127.0.0.1:8000
```

## Content model — what's editable where

- **Database** (via the admin panel): anything Alara might reword —
  personal details, skills, projects, education, experience, languages,
  toolkit, certificates, plus (§Faz 2) the biography, hobbies,
  specialties, and section headings that used to be hardcoded in
  `frontend/index.html`.
- **`frontend/src/i18n/dictionaries/*.ts`** (requires a frontend
  rebuild): developer-owned interface chrome — nav labels, button text,
  form labels/placeholders, modal metadata headings, error strings.
  These render before the API response arrives.

Every translatable database field is stored as JSON `{tr, en, nl}` and
falls back to `tr` when a locale is empty (see `app/Casts/Translatable.php`
and `app/Support/TranslatedText.php`). `GET /api/portfolio` returns the
raw `{tr,en,nl}` objects — the frontend resolves the active locale
client-side so switching languages never triggers a request.

## Architecture notes

- **Auth**: HttpOnly `auth_token` cookie, raw HS256 JWT (not a Laravel
  session/Sanctum token — see `app/Services/AdminJwt.php`'s docblock for
  why), `sameSite=strict`, 2h TTL. Must stay same-origin with the
  frontend (see root `nginx.conf`) or the cookie stops working.
- **Rate limiting & security alerts**: backed by Redis (`app/Providers/AppServiceProvider.php`,
  `app/Services/SecurityAlerts.php`) so limits are shared across
  php-fpm's worker processes — "array"/"file" cache stores would give
  every worker its own counter.
- **`config/webas.php`**: centralizes the handful of env vars
  (`JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`,
  `FAILED_LOGIN_ALERT_THRESHOLD`) that services used to read via a raw
  `env()` call at runtime. Read that file's docblock before adding a new
  runtime `env()` call anywhere — under `php artisan config:cache`
  (which any real deploy runs) `env()` silently returns `null` outside
  of config files, which is what used to make `AdminJwt` fall back to a
  publicly-known default signing secret.

## What was deliberately not ported

`PATCH /api/portfolio/:section` (legacy) — the old frontend never called
it and it had no request validation server-side either.
