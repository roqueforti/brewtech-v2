FROM webdevops/php-apache:8.2

# webdevops/php-apache:8.2 already includes:
# pdo, pdo_mysql, mbstring, gd, zip, intl, opcache, bcmath, exif, etc.
# No manual extension installation needed!

# Install Node.js and npm
RUN apt-get update && apt-get install -y nodejs npm \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set document root to Laravel public/
ENV WEB_DOCUMENT_ROOT=/app/public
ENV PHP_DISMOD=xdebug

WORKDIR /app

# Copy source code
COPY . .

# Install PHP dependencies
RUN COMPOSER_MEMORY_LIMIT=-1 composer install --no-dev --optimize-autoloader --no-interaction

# Install Node dependencies and build frontend assets
RUN npm ci && npm run build

# Set permissions
RUN chown -R application:application /app/storage /app/bootstrap/cache \
    && chmod -R 775 /app/storage /app/bootstrap/cache

EXPOSE 80

CMD ["/entrypoint", "supervisord"]
