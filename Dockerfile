# Use a lightweight official PHP-Apache server base image
FROM php:8.2-apache

# Install dependencies and setup modernized NodeSource repository
RUN apt-get update && apt-get install -y \
    curl \
    gnupg \
    ca-certificates \
    && mkdir -p /etc/apt/keyrings \
    && curl -fsSL https://nodesource.com | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg \
    && echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://nodesource.com nodistro main" | tee /etc/apt/etc/apt/sources.list.d/nodesource.list \
    && apt-get update && apt-get install -y nodejs \
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
