FROM richarvey/nginx-php-fpm:3.1.6

# Install Node.js (required for Inertia + React)
RUN apk add --no-cache nodejs npm

# Copy application files
COPY . .

# Install Composer dependencies (do NOT skip)
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Install Node.js dependencies and build assets (required for Inertia)
RUN npm install && npm run prod

# Fix Laravel permissions
RUN chmod -R 777 storage bootstrap/cache

# Image config (remove SKIP_COMPOSER since we run it manually)
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

CMD ["/start.sh"]
