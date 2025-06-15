FROM richarvey/nginx-php-fpm:3.1.6

# Install Node.js for Inertia/React
RUN apk add --no-cache nodejs npm

# Create PHP-FPM socket directory with correct permissions
RUN mkdir -p /var/run/php && chown www-data:www-data /var/run/php

# Copy application files
COPY . .

# Install dependencies
RUN composer install --no-dev --optimize-autoloader --no-interaction
RUN npm install && npm run build

# Fix Laravel permissions
RUN chmod -R 777 storage bootstrap/cache

# Configure PHP-FPM to use TCP (more reliable than sockets in Docker)
RUN sed -i 's/listen = .*/listen = 9000/' /etc/php7/php-fpm.d/www.conf

# Configure Nginx to use TCP instead of socket
RUN sed -i 's#fastcgi_pass unix:.*#fastcgi_pass 127.0.0.1:9000;#' /etc/nginx/conf.d/default.conf

# Environment variables
ENV WEBROOT /var/www/html/public
ENV PHP_ERRORS_STDERR 1
ENV RUN_SCRIPTS 1
ENV REAL_IP_HEADER 1
ENV APP_ENV production
ENV APP_DEBUG false
ENV LOG_CHANNEL stderr
ENV COMPOSER_ALLOW_SUPERUSER 1

# Start both services
CMD sh -c "php-fpm -D && nginx -g 'daemon off;'"
