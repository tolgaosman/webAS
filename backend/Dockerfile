# php-fpm image for the Laravel API (§Faz 8).
FROM php:8.4-fpm-alpine

RUN apk add --no-cache \
        git curl libzip-dev zip unzip icu-dev oniguruma-dev su-exec \
    && docker-php-ext-install pdo pdo_mysql zip intl opcache bcmath

# phpredis (hata #6): CACHE_STORE=redis + REDIS_CLIENT=phpredis need the
# actual PECL extension — without it every request that touches the rate
# limiter (i.e. all of them, throttle:global wraps every route) 500s.
RUN apk add --no-cache --virtual .build-deps $PHPIZE_DEPS \
    && pecl install redis \
    && docker-php-ext-enable redis \
    && apk del .build-deps

# hata #5: raise PHP's own upload limits past nginx's 10m and the app's 8MB check.
COPY docker/php.ini /usr/local/etc/php/conf.d/99-webas.ini

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/backend

COPY composer.json composer.lock* ./
RUN composer install --no-dev --no-scripts --no-autoloader --prefer-dist --no-blocking

COPY . .
RUN composer dump-autoload --optimize --no-dev

RUN chown -R www-data:www-data storage bootstrap/cache

# entrypoint.sh (hata #7): the container must start as root so it can
# chown the ./uploads bind mount (docker-compose.yaml) before dropping
# to www-data — Coolify recreates that host directory as root:root on
# any deploy where it doesn't already exist, which otherwise makes
# every /api/portfolio/upload-image request 500 with "sunucu yükleme
# klasörüne yazamıyor" (see PortfolioController::uploadImage). su-exec
# does the actual privilege drop; the php-fpm master process still ends
# up running as www-data, same as the old `USER www-data` line did.
RUN chmod +x docker/entrypoint.sh

EXPOSE 9000

ENTRYPOINT ["docker/entrypoint.sh"]
CMD ["php-fpm"]
