# webAS

Alara Soysan's portfolio site (alarasysn.com) — React + TypeScript frontend, Laravel 11 API, MySQL, deployed on Hetzner via Docker Compose.

## Layout

```
frontend/    React + TypeScript (Vite). Two entry points: the public
             site (index.html) and the admin panel (admin.html).
             See frontend/vite.config.ts.
backend/     Laravel 11 API. See backend/README.md for setup.
legacy/      The original Express/TypeScript backend, kept for
             reference/rollback during cutover. Not deployed.
```

Root-level `Dockerfile`, `docker-compose.yml`, and `nginx.conf` build and
serve both halves behind one nginx server (same-origin, required for
the `auth_token` cookie's `sameSite=strict` to keep working).

## Local development

```bash
# Frontend, against a real backend on :8000
cd frontend && npm install && npm run dev

# Frontend, against a bundled fixture (no PHP/MySQL needed at all —
# useful for building/reviewing UI in isolation)
cd frontend && npm run dev:mock

# Backend
cd backend && composer install && cp .env.example .env
php artisan key:generate && php artisan migrate --seed
php artisan serve
```

## Deployment

```bash
cp .env.example .env                 # repo root — MySQL creds for docker-compose
cp backend/.env.example backend/.env # fill in JWT_SECRET, ADMIN_EMAIL, etc.
mkdir -p uploads                     # runtime image uploads, bind-mounted (NOT frontend/public/assets/uploads)
docker compose build && docker compose up -d
docker compose exec php php artisan key:generate --force
docker compose exec php php artisan migrate --force
docker compose exec php php artisan db:seed --force
docker compose exec php php artisan portfolio:import /var/www/backend/../portfolio-data.json --dry-run
```

Full context for every decision above lives in the migration plan this
repo was rewritten under (`sen-daha-ok-ilerlemeden-bright-yao.md`) and
in the docblocks throughout `backend/` and `frontend/src/`.
