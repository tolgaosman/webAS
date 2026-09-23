#!/bin/sh
# Fixes the "server can't write to upload folder" 500 on
# /api/portfolio/upload-image (PortfolioController::uploadImage): Coolify
# recreates the ./uploads bind mount (docker-compose.yaml) as a fresh
# root:root directory on the host whenever it doesn't already exist, but
# the php-fpm container runs entirely as www-data (no root step to chown
# it). Re-chowning here, once per container start, before dropping to
# www-data, makes it self-healing regardless of who owns the mount on
# the host — storage/bootstrap/cache too, in case a redeploy replaced
# those as root as well.
set -e

chown -R www-data:www-data storage bootstrap/cache /var/www/uploads 2>/dev/null || true

exec su-exec www-data "$@"
