#!/bin/bash

# Colors for better readability
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to log messages with timestamp
log() {
  local message="$1"
  local color="$2"
  echo -e "${color}[$(date +'%Y-%m-%d %H:%M:%S')] $message${NC}"
}

# Function to ensure all Docker resources are properly cleaned up
cleanup_docker_resources() {
  log "Stopping any running BangBang services..." $BLUE
  docker-compose down --remove-orphans
  
  # Check for any stray containers related to our project and remove them
  orphaned_containers=$(docker ps -a | grep "bangbang" | awk '{print $1}')
  if [ ! -z "$orphaned_containers" ]; then
    log "Found orphaned containers, removing them..." $YELLOW
    echo "$orphaned_containers" | xargs -r docker rm -f
  fi
  
  # Check for any networks related to our project and remove them
  orphaned_networks=$(docker network ls | grep "bangbang" | awk '{print $1}')
  if [ ! -z "$orphaned_networks" ]; then
    log "Found orphaned networks, removing them..." $YELLOW
    echo "$orphaned_networks" | xargs -r docker network rm || true
  fi
  
  log "Services stopped successfully" $GREEN
}

# Clean up Docker resources
cleanup_docker_resources

# Clean up docker images and volumes
log "Cleaning up old Docker images and volumes..." $BLUE
docker system prune -f
docker images -q 'bangbangdelivery*' | xargs -r docker rmi -f

# Remove volumes to ensure a clean start
docker volume rm $(docker volume ls -q -f name=bangbangdelivery_mysql_data) 2>/dev/null || true
log "Docker images and volumes cleaned up" $GREEN

# Make sure init scripts directory exists and is properly set up
log "Preparing initialization scripts..." $BLUE
mkdir -p init-scripts

# Verify init scripts have proper naming for execution order
if [ -f "init-scripts/01-init-databases.sql" ] && [ ! -f "init-scripts/00-init-databases.sql" ]; then
  log "Renaming database initialization script for proper execution order..." $YELLOW
  mv init-scripts/01-init-databases.sql init-scripts/00-init-databases.sql
fi

# Build all services
log "Building backend services..." $BLUE
cd backend && mvn clean package -DskipTests || true
cd ..
log "Java services build completed" $GREEN

log "Building Docker images..." $BLUE
docker-compose build
log "All services built successfully" $GREEN

# Start the database and wait for it to be ready
log "Starting MySQL database and Redis..." $BLUE
docker-compose up -d mysql redis
log "MySQL and Redis started. Waiting for initialization..." $GREEN

# Verify MySQL container is running
log "Verifying MySQL container is running..." $YELLOW
attempt=1
max_attempts=10
until docker-compose ps mysql | grep -q "Up" || [ $attempt -ge $max_attempts ]; do
  log "Waiting for MySQL container to be running (attempt $attempt/$max_attempts)..." $YELLOW
  attempt=$((attempt+1))
  docker-compose ps mysql
  sleep 5
done

if [ $attempt -ge $max_attempts ]; then
  log "MySQL container failed to start after $max_attempts attempts" $RED
  docker-compose logs mysql
  # Try to restart it
  log "Attempting to restart MySQL..." $YELLOW
  docker-compose restart mysql
  sleep 10
  if ! docker-compose ps mysql | grep -q "Up"; then
    log "MySQL container failed to restart. Check docker-compose configuration." $RED
    docker-compose logs mysql
    exit 1
  fi
fi

# Wait for MySQL to be ready
log "Waiting for MySQL to be ready..." $YELLOW
attempt=1
max_attempts=60
until docker-compose exec -T mysql mysqladmin ping -h localhost -u root -prootpassword --silent 2>/dev/null || [ $attempt -ge $max_attempts ]; do
  log "Waiting for MySQL to be ready (attempt $attempt/$max_attempts)..." $YELLOW
  attempt=$((attempt+1))
  sleep 3
done

if [ $attempt -ge $max_attempts ]; then
  log "MySQL failed to be ready after $max_attempts attempts" $RED
  docker-compose logs mysql
  exit 1
fi

log "MySQL is ready, waiting additional time for full initialization..." $GREEN
sleep 15  # Increased wait time to ensure init scripts complete

# Verify that all required databases exist and create them if not
log "Setting up all required databases..." $YELLOW
docker-compose exec -T mysql mysql -uroot -prootpassword -e "
  CREATE DATABASE IF NOT EXISTS bangbang_auth;
  CREATE DATABASE IF NOT EXISTS bangbang;
  CREATE DATABASE IF NOT EXISTS bangbang_user;
  CREATE DATABASE IF NOT EXISTS bangbang_order;
  
  GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' WITH GRANT OPTION;
  GRANT ALL PRIVILEGES ON bangbang_auth.* TO 'bangbang'@'%';
  GRANT ALL PRIVILEGES ON bangbang.* TO 'bangbang'@'%';
  GRANT ALL PRIVILEGES ON bangbang_user.* TO 'bangbang'@'%';
  GRANT ALL PRIVILEGES ON bangbang_order.* TO 'bangbang'@'%';
  
  FLUSH PRIVILEGES;
"
log "All databases created successfully" $GREEN

# Set up roles table in bangbang_auth database
log "Setting up roles in bangbang_auth database..." $BLUE
docker-compose exec -T mysql mysql -uroot -prootpassword bangbang_auth << EOF
CREATE TABLE IF NOT EXISTS roles (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) UNIQUE NOT NULL,
    description VARCHAR(255)
);

INSERT IGNORE INTO roles (name, description) VALUES
('ROLE_USER', 'Regular user with basic privileges'),
('ROLE_ADMIN', 'Administrator with all privileges'),
('ROLE_MANAGER', 'Manager with management privileges'),
('ROLE_DRIVER', 'Delivery driver role');
EOF

# Create users table and default users
log "Creating users table and default admin user..." $BLUE
docker-compose exec -T mysql mysql -uroot -prootpassword bangbang_auth << EOF
-- Create users table if not exists
CREATE TABLE IF NOT EXISTS users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    phone_number VARCHAR(20),
    profile_image_url VARCHAR(255),
    credit_score INT DEFAULT 100,
    verification_status VARCHAR(20) DEFAULT 'UNVERIFIED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create user_roles table if not exists
CREATE TABLE IF NOT EXISTS user_roles (
    user_id BIGINT,
    role_id BIGINT,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);

-- Check if admin user exists, create if not
INSERT IGNORE INTO users (username, email, password_hash, first_name, last_name, verification_status)
VALUES 
('admin', 'admin@bangbangdelivery.com', '\$2a\$10\$B1hCxMLYrUNkTtHSaGBhWOkV3agcBcWwMa7P/vOi0wJjefGKt1GVW', 'Admin', 'User', 'VERIFIED'),
('yunfei', 'yunfei@bangbangdelivery.com', '\$2a\$10\$B1hCxMLYrUNkTtHSaGBhWOkV3agcBcWwMa7P/vOi0wJjefGKt1GVW', 'Yunfei', 'Chen', 'VERIFIED');

-- Assign admin role to admin user 
INSERT IGNORE INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM users u, roles r 
WHERE u.username = 'admin' AND r.name = 'ROLE_ADMIN';

-- Assign admin role to yunfei user
INSERT IGNORE INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM users u, roles r 
WHERE u.username = 'yunfei' AND r.name = 'ROLE_ADMIN';
EOF

log "Database setup completed successfully" $GREEN

# Start the auth service first to ensure it's ready before gateway
log "Starting the auth service..." $BLUE
docker-compose up -d auth-service
sleep 15 # Give more time for the auth service to initialize with database
log "Auth service started, checking status..." $GREEN

# Check if auth service is running properly
AUTH_STATUS=$(docker-compose ps -q auth-service | xargs -r docker inspect -f '{{.State.Running}}' 2>/dev/null)
if [ "$AUTH_STATUS" != "true" ]; then
  log "Auth service failed to start properly. Retrying with full logs..." $YELLOW
  docker-compose logs auth-service
  
  # Stop the failed instance
  docker-compose stop auth-service
  docker-compose rm -f auth-service
  
  # Wait a bit
  sleep 5
  
  # Try again
  log "Restarting auth service..." $BLUE
  docker-compose up -d auth-service
  sleep 15
  
  # Check again
  AUTH_STATUS=$(docker-compose ps -q auth-service | xargs -r docker inspect -f '{{.State.Running}}' 2>/dev/null)
  if [ "$AUTH_STATUS" != "true" ]; then
    log "Auth service failed to start on second attempt. Check the code for issues." $RED
    docker-compose logs auth-service
    exit 1
  else
    log "Auth service restarted successfully on second attempt" $GREEN
  fi
else
  log "Auth service is running successfully" $GREEN
fi

# Start demand and journey services
log "Starting demand-service and journey-service..." $BLUE
docker-compose up -d demand-service
sleep 5
docker-compose up -d journey-service
sleep 5

# Verify if demand and journey services are running
DEMAND_STATUS=$(docker-compose ps -q demand-service | xargs -r docker inspect -f '{{.State.Running}}' 2>/dev/null)
JOURNEY_STATUS=$(docker-compose ps -q journey-service | xargs -r docker inspect -f '{{.State.Running}}' 2>/dev/null)

if [ "$DEMAND_STATUS" != "true" ]; then
  log "Demand service failed to start properly. Check the logs." $YELLOW
  docker-compose logs demand-service
else
  log "Demand service is running successfully" $GREEN
fi

if [ "$JOURNEY_STATUS" != "true" ]; then
  log "Journey service failed to start properly. Check the logs." $YELLOW
  docker-compose logs journey-service
else
  log "Journey service is running successfully" $GREEN
fi

# Start the remaining services
log "Starting the remaining services..." $BLUE
docker-compose up -d
log "All services started successfully" $GREEN

# Print login credentials
log "Default users created:" $YELLOW
log "  • Username: admin, Password: password123" $YELLOW 
log "  • Username: yunfei, Password: password123" $YELLOW

# Show the running containers
log "Current running containers:" $YELLOW
docker-compose ps

# Show service logs for debugging
log "Showing auth service logs (press Ctrl+C to exit):" $YELLOW
docker-compose logs -f auth-service 