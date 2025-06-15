FROM richarvey/nginx-php-fpm:3.1.6

# Install Node.js (required for Inertia + React)
RUN apk add --no-cache nodejs npm

# Copy application files
COPY . .

# Install Composer dependencies
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Install Node.js dependencies and build assets
RUN npm install && npm run build

# Fix Laravel permissions
RUN chmod -R 777 storage bootstrap/cache

# Ensure PHP-FPM socket directory exists and has correct permissions
RUN mkdir -p /var/run/php && chown www-data:www-data /var/run/php

# Image config
ENV WEBROOT /var/www/html/public
ENV PHP_ERRORS_STDERR 1
ENV RUN_SCRIPTS 1
ENV REAL_IP_HEADER 1

# Laravel config
ENV APP_ENV production
ENV APP_DEBUG false
ENV LOG_CHANNEL stderr

# Allow Composer to run as root
ENV COMPOSER_ALLOW_SUPERUSER 1

# Explicitly start PHP-FPM before Nginx (if needed)
CMD sh -c "php-fpm -D && nginx -g 'daemon off;'"
