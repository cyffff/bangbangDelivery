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

# Stop existing services
log "Stopping any running BangBang services..." $BLUE
docker-compose down
log "Services stopped successfully" $GREEN

# Clean up docker images and volumes
log "Cleaning up old Docker images and volumes..." $BLUE
docker system prune -f
docker images -q 'bangbangdelivery*' | xargs -r docker rmi -f

# Remove volumes to ensure a clean start
docker volume rm $(docker volume ls -q -f name=bangbangdelivery_mysql_data) 2>/dev/null || true
log "Docker images and volumes cleaned up" $GREEN

# Make sure init scripts directory exists
mkdir -p init-scripts

# Build the services
log "Building auth service..." $BLUE
cd backend/auth-service && mvn clean package -DskipTests && cd ../..
log "Auth service Java build completed" $GREEN

log "Building Docker images..." $BLUE
docker-compose build
log "All services built successfully" $GREEN

# Start the database and wait for it to be ready
log "Starting MySQL database first..." $BLUE
docker-compose up -d mysql redis
log "MySQL and Redis started. Waiting for initialization..." $GREEN

# Wait for MySQL to be ready
log "Waiting for MySQL to be ready..." $YELLOW
attempt=1
max_attempts=60
until docker-compose exec -T mysql mysqladmin ping -h localhost -u root -prootpassword --silent || [ $attempt -ge $max_attempts ]; do
  log "Waiting for MySQL to be ready (attempt $attempt/$max_attempts)..." $YELLOW
  attempt=$((attempt+1))
  sleep 3
done

if [ $attempt -ge $max_attempts ]; then
  log "MySQL failed to start after $max_attempts attempts" $RED
  docker-compose logs mysql
  exit 1
fi

log "MySQL is ready, waiting additional time for full initialization..." $GREEN
sleep 10

# Explicitly create the bangbang_auth database and set up permissions
log "Setting up database permissions..." $BLUE
attempt=1
max_attempts=5
while [ $attempt -le $max_attempts ]; do
  if docker-compose exec -T mysql mysql -uroot -prootpassword << EOF
CREATE DATABASE IF NOT EXISTS bangbang_auth;
CREATE DATABASE IF NOT EXISTS bangbang;
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' WITH GRANT OPTION;
GRANT ALL PRIVILEGES ON bangbang_auth.* TO 'bangbang'@'%';
GRANT ALL PRIVILEGES ON bangbang.* TO 'bangbang'@'%';
FLUSH PRIVILEGES;
EOF
  then
    log "Database permissions set up successfully" $GREEN
    break
  else
    log "Failed to set database permissions (attempt $attempt/$max_attempts). Retrying..." $YELLOW
    attempt=$((attempt+1))
    sleep 5
  fi
done

if [ $attempt -gt $max_attempts ]; then
  log "Failed to set database permissions after $max_attempts attempts" $RED
  docker-compose logs mysql
  exit 1
fi

# Verify database connectivity with retry
log "Verifying database connectivity..." $YELLOW
attempt=1
max_attempts=5
while [ $attempt -le $max_attempts ]; do
  if docker-compose exec -T mysql mysql -uroot -prootpassword -e "USE bangbang_auth; SHOW TABLES;" &> /dev/null; then
    log "Database connectivity verified successfully" $GREEN
    break
  else
    log "Failed to connect to database (attempt $attempt/$max_attempts). Retrying..." $YELLOW
    attempt=$((attempt+1))
    sleep 5
  fi
done

if [ $attempt -gt $max_attempts ]; then
  log "Failed to connect to database after $max_attempts attempts" $RED
  docker-compose logs mysql
  exit 1
fi

# Start the auth service first to ensure it's ready before gateway
log "Starting the auth service..." $BLUE
docker-compose up -d auth-service
sleep 15 # Give more time for the auth service to initialize with database
log "Auth service started, checking status..." $GREEN

# Check if auth service is running properly
AUTH_STATUS=$(docker-compose ps -q auth-service | xargs -r docker inspect -f '{{.State.Running}}')
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
  AUTH_STATUS=$(docker-compose ps -q auth-service | xargs -r docker inspect -f '{{.State.Running}}')
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

# Start the remaining services
log "Starting the remaining services..." $BLUE
docker-compose up -d
log "All services started successfully" $GREEN

# Show the running containers
log "Current running containers:" $YELLOW
docker-compose ps

# Show service logs for debugging
log "Showing auth service logs (press Ctrl+C to exit):" $YELLOW
docker-compose logs -f auth-service 