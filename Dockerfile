# Build stage
FROM node:20-alpine AS builder

# Enable Corepack to use the correct package manager version
RUN corepack enable

WORKDIR /app

# Accept build arguments for environment variables
ARG VITE_APP_API_URL
ARG VITE_APP_BASE_NAME=/

# Set as environment variables for Vite build
ENV VITE_APP_API_URL=$VITE_APP_API_URL
ENV VITE_APP_BASE_NAME=$VITE_APP_BASE_NAME

# Copy package files and Yarn configuration
COPY package.json yarn.lock* package-lock.json* .yarnrc.yml* ./

# Install dependencies
RUN if [ -f yarn.lock ]; then \
        corepack prepare yarn@4.9.1 --activate && \
        yarn install --frozen-lockfile; \
    elif [ -f package-lock.json ]; then npm ci; \
    else echo "Lockfile not found." && exit 1; \
    fi

# Copy .env file if it exists (for reference, Vite will use ENV vars)
COPY .env* ./

# Copy all source files (node_modules excluded by .dockerignore)
COPY . .

# Build the application (node_modules from previous step should be preserved)
RUN if [ -f yarn.lock ]; then \
        corepack prepare yarn@4.9.1 --activate && \
        yarn build; \
    elif [ -f package-lock.json ]; then npm run build; \
    else echo "No lockfile found." && exit 1; \
    fi

# Production stage
FROM nginx:alpine

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built files from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

