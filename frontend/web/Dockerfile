FROM node:16-alpine as build

WORKDIR /app

# Copy package files first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Set environment variables to ignore TypeScript errors
ENV CI=false
ENV SKIP_PREFLIGHT_CHECK=true
ENV DISABLE_ESLINT_PLUGIN=true
ENV TSC_COMPILE_ON_ERROR=true

# Build the application
RUN npm run build

# Production environment
FROM nginx:alpine

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy built assets from the build stage
COPY --from=build /app/build/ /usr/share/nginx/html/

# Copy our fallback/loading index.html to serve while the React app is initializing
COPY nginx/index.html /usr/share/nginx/html/loading.html

# Set up nginx configuration
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# Fix permissions for the nginx user to access all files
RUN chmod -R 755 /usr/share/nginx/html && \
    chown -R nginx:nginx /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"] 