FROM php:8.4-fpm-alpine

RUN apk add --no-cache \
        nginx \
        postgresql-dev \
        icu-dev \
        libpng-dev \
        libjpeg-turbo-dev \
        freetype-dev \
        libwebp-dev \
        libzip-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg --with-webp \
    && docker-php-ext-install -j"$(nproc)" pdo_pgsql pgsql intl gd zip opcache

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app

ENV APP_ENV=prod
ENV COMPOSER_ALLOW_SUPERUSER=1

COPY . .

RUN composer install --no-dev --optimize-autoloader --no-interaction --no-progress \
    && mkdir -p var/cache var/log public/media/photos \
    && chown -R www-data:www-data var public/media

COPY docker/nginx.conf /etc/nginx/http.d/default.conf
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 8080
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
