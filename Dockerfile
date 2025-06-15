FROM richarvey/nginx-php-fpm:3.1.6

WORKDIR /var/www/html

COPY . .

# Laravel + server environment
ENV SKIP_COMPOSER 0
ENV RUN_SCRIPTS 1
ENV PHP_ERRORS_STDERR 1
ENV COMPOSER_ALLOW_SUPERUSER 1
ENV WEBROOT /var/www/html/public
ENV APP_ENV production
ENV APP_DEBUG false
ENV LOG_CHANNEL stderr

# Set correct permissions
RUN chmod -R 775 storage bootstrap/cache

# Build React frontend
RUN curl -sL https://deb.nodesource.com/setup_18.x | bash - \
 && apt-get install -y nodejs \
 && npm install && npm run build

# Cache Laravel config
RUN php artisan config:cache && php artisan route:cache && php artisan view:cache

CMD ["/start.sh"]
