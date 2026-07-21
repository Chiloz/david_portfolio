# Use a lightweight official PHP-Apache server base image
FROM php:8.2-apache

# Install nodejs and npm to support front-end script elements if needed
RUN apt-get update && apt-get install -y \
    curl \
    && curl -sL https://nodesource.com | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# Enable Apache rewrite modules for routing backend scripts cleanly
RUN a2enmod rewrite

# Set our server working directory context root
WORKDIR /var/www/html

# Copy the entire repository layout into the Apache serving window
COPY . .

# Adjust web server permissions safely over the backend directory path
RUN chown -R www-data:www-data /var/www/html

# Expose the standard web communication traffic port
EXPOSE 80

# Spin up Apache in the foreground process loop
CMD ["apache2-foreground"]
