# php-fpm image for the Laravel API (§Faz 8).
FROM php:8.3-fpm-alpine

RUN apk add --no-cache \
        git curl libzip-dev zip unzip icu-dev oniguruma-dev \
    && docker-php-ext-install pdo pdo_mysql zip intl opcache bcmath

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/api

COPY composer.json composer.lock* ./
RUN composer install --no-dev --no-scripts --no-autoloader --prefer-dist

COPY . .
RUN composer dump-autoload --optimize --no-dev

RUN mkdir -p storage/framework/{cache,sessions,views} storage/logs bootstrap/cache \
    && chown -R www-data:www-data storage bootstrap/cache

USER www-data

EXPOSE 9000

CMD ["php-fpm"]
