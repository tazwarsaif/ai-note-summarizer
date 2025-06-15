FROM richarvey/nginx-php-fpm:3.1.6

# Install Node.js for Inertia/React
RUN apk add --no-cache nodejs npm

# Copy application files
COPY . .

# Install dependencies
RUN composer install --no-dev --optimize-autoloader --no-interaction
RUN npm install && npm run build

# Fix Laravel permissions
RUN chmod -R 777 storage bootstrap/cache

# Find and modify the correct PHP-FPM config file
RUN if [ -f /etc/php8/php-fpm.d/www.conf ]; then \
        sed -i 's/listen = .*/listen = 9000/' /etc/php8/php-fpm.d/www.conf; \
    elif [ -f /etc/php7/php-fpm.d/www.conf ]; then \
        sed -i 's/listen = .*/listen = 9000/' /etc/php7/php-fpm.d/www.conf; \
    else \
        echo "Could not find PHP-FPM config file"; exit 1; \
    fi

# Update Nginx config to use TCP
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
