FROM richarvey/nginx-php-fpm:3.1.6

# Set working directory
WORKDIR /var/www/html

# Install Node.js (LTS version)
RUN apk add --no-cache --repository http://dl-cdn.alpinelinux.org/alpine/v3.17/main/ nodejs=18.20.1-r0 npm=18.20.1-r0

# Copy package files first to leverage Docker cache
COPY package.json package-lock.json ./
COPY composer.json composer.lock ./

# Install PHP and Node dependencies
RUN composer install --no-dev --no-interaction --optimize-autoloader \
    && npm ci --production

# Copy application files
COPY . .

# Build production assets
RUN npm run build

# Image config
ENV SKIP_COMPOSER 1
ENV WEBROOT /var/www/html/public
ENV PHP_ERRORS_STDERR 1
ENV RUN_SCRIPTS 1
ENV REAL_IP_HEADER 1

# Laravel config
ENV APP_ENV production
ENV APP_DEBUG false
ENV LOG_CHANNEL stderr

# Allow composer to run as root
ENV COMPOSER_ALLOW_SUPERUSER 1

# Set permissions
RUN chown -R www-data:www-data storage bootstrap/cache

# Generate application key if not present (will be overridden by Render's env vars)
RUN if [ -z "$APP_KEY" ]; then \
    php artisan key:generate --show; \
    fi

CMD ["/start.sh"]
