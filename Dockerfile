# Use official Node.js long-term support image
FROM node:20-slim

# Set working directory
WORKDIR /app

# Copy dependency manifests
COPY package.json package-lock.json* bun.lock* ./

# Install dependencies
RUN npm install

# Copy all source files
COPY . .

# Build the client and server assets
RUN npm run build

# Expose the application port
EXPOSE 3000

# Set environment to production
ENV NODE_ENV=production

# Start the application
CMD ["npm", "start"]
