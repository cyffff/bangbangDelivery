FROM node:16-alpine

WORKDIR /app

# Create directory structure
RUN mkdir -p src/models src/controllers src/routes src/utils

# Copy package files
COPY package*.json ./
RUN npm install

# Copy source code
COPY src/ ./src/

# Expose port
EXPOSE 8082

# Start server
CMD ["npm", "start"] 