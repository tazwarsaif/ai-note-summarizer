FROM richarvey/nginx-php-fpm:3.1.6

# Install Node.js and npm (Alpine Linux way)
RUN apk add --no-cache \
    nodejs \
    npm \
    python3 \
    make \
    g++

# Set working directory
WORKDIR /var/www/html

# Copy package files first for better caching
COPY package*.json ./
COPY composer.json composer.lock ./

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Install Node.js dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Build frontend assets
RUN npm run prod

# Fix Laravel permissions
RUN chmod -R 777 storage bootstrap/cache

# Configure PHP-FPM to use TCP (more reliable in Docker)
# First, let's find the actual PHP-FPM config file location
RUN PHP_FPM_CONF=$(find /etc -name "www.conf" | head -n 1) && \
    if [ -z "$PHP_FPM_CONF" ]; then \
        echo "ERROR: Could not find PHP-FPM config file"; \
        find /etc -name "*fpm*" -o -name "*php*" > /tmp/php_files.txt; \
        cat /tmp/php_files.txt; \
        exit 1; \
    else \
        echo "Found PHP-FPM config at: $PHP_FPM_CONF"; \
        sed -i "s/listen = .*/listen = 9000/" "$PHP_FPM_CONF"; \
        # Also ensure the listen directive isn't commented out
        sed -i "s/^;listen = .*/listen = 9000/" "$PHP_FPM_CONF"; \
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
