#!/bin/sh
set -e

if [ -z "$APP_KEY" ]; then
    echo "APP_KEY is not set"
    exit 1
fi

php artisan migrate --force --no-interaction

# Seed only on first deploy — when the users table is empty
USER_COUNT=$(php -r "
try {
    \$pdo = new PDO(
        'pgsql:host=' . getenv('DB_HOST') . ';port=' . getenv('DB_PORT') . ';dbname=' . getenv('DB_DATABASE'),
        getenv('DB_USERNAME'), getenv('DB_PASSWORD')
    );
    echo \$pdo->query('SELECT COUNT(*) FROM users')->fetchColumn();
} catch (Exception \$e) { echo 0; }
" 2>/dev/null)

if [ "$USER_COUNT" = "0" ]; then
    echo "Fresh database — running seeders..."
    php artisan db:seed --force --no-interaction
fi

php artisan config:cache
php artisan view:cache
mkdir -p storage/api-docs
chown -R www-data:www-data storage
php artisan l5-swagger:generate || true

exec "$@"
