FROM php:8.2-fpm AS base

RUN apt-get update && apt-get install -y --no-install-recommends \
        libpq-dev \
        libzip-dev \
        libicu-dev \
        unzip \
        autoconf \
        gcc \
        g++ \
        make \
    && docker-php-ext-install pdo_pgsql zip intl \
    && docker-php-ext-enable opcache \
    && curl -L https://github.com/phpredis/phpredis/archive/refs/tags/6.1.0.tar.gz \
         -o /tmp/phpredis.tar.gz \
    && mkdir /tmp/phpredis \
    && tar xzf /tmp/phpredis.tar.gz -C /tmp/phpredis --strip-components=1 \
    && cd /tmp/phpredis \
    && phpize \
    && ./configure \
    && make -j"$(nproc)" \
    && make install \
    && docker-php-ext-enable redis \
    && rm -rf /tmp/phpredis /tmp/phpredis.tar.gz \
    && apt-get purge -y autoconf gcc g++ make \
    && apt-get autoremove -y \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

FROM base AS development

COPY composer.json composer.lock ./
RUN composer install --no-scripts --no-autoloader

COPY . .
RUN composer dump-autoload --optimize

EXPOSE 9000
CMD ["php-fpm"]

FROM base AS production

COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

COPY composer.json composer.lock ./
RUN composer install --no-dev --no-scripts --no-autoloader

COPY . .
RUN composer dump-autoload --optimize --classmap-authoritative \
    && chown -R www-data:www-data storage bootstrap/cache

EXPOSE 9000
ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
CMD ["php-fpm"]
