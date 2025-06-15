FROM richarvey/nginx-php-fpm:3.1.6

WORKDIR /var/www/html

COPY . .

# Laravel config
ENV APP_ENV=production
ENV APP_DEBUG=false
ENV LOG_CHANNEL=stderr
ENV COMPOSER_ALLOW_SUPERUSER=1
ENV SKIP_COMPOSER=0
ENV WEBROOT=/var/www/html/public
ENV PHP_ERRORS_STDERR=1
ENV RUN_SCRIPTS=1
ENV REAL_IP_HEADER=1

# Install nodejs & npm
RUN apk update && apk add --no-cache nodejs npm

# Build Vite assets
RUN npm install && npm run build

# Start PHP-FPM + Nginx
CMD ["/start.sh"]
