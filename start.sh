#!/bin/bash

# Colors for better visibility
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print with timestamp
log() {
    echo -e "${2}[$(date +"%Y-%m-%d %H:%M:%S")] $1${NC}"
}

# Error handling
handle_error() {
    log "ERROR: $1" "${RED}"
    log "Stopping any started services..." "${YELLOW}"
    ./stop.sh
    exit 1
}

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    handle_error "Docker is not running. Please start Docker first."
fi

log "Starting BangBang Delivery Platform..." "${GREEN}"

# Create logs directory if it doesn't exist
mkdir -p logs

# Check for command-line arguments
FRONTEND_ONLY=false
BACKEND_ONLY=false

while [[ $# -gt 0 ]]; do
  case "$1" in
    --frontend-only)
      FRONTEND_ONLY=true
      ;;
    --backend-only)
      BACKEND_ONLY=true
      ;;
    *)
      log "Unknown option: $1" "${RED}"
      log "Usage: ./start.sh [--frontend-only] [--backend-only]" "${YELLOW}"
      exit 1
      ;;
  esac
  shift
done

# Start services based on parameters
if [ "$FRONTEND_ONLY" = true ]; then
    log "Starting frontend services only..." "${BLUE}"
    docker-compose up -d frontend
elif [ "$BACKEND_ONLY" = true ]; then
    log "Starting backend services only..." "${BLUE}"
    docker-compose up -d mysql redis gateway auth-service user-service order-service demand-service journey-service payment-service messaging-service notification-service search-service
else
    log "Starting all services (infrastructure, backend, frontend)..." "${BLUE}"
    docker-compose up -d
fi

# Wait for services to initialize
log "Waiting for services to initialize..." "${YELLOW}"
sleep 15

# Debug: List all running containers
log "Running containers:" "${BLUE}"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

# Success
log "BangBang Delivery Platform started successfully! 🚀" "${GREEN}"

# Print service endpoints based on what was started
if [ "$BACKEND_ONLY" = false ]; then
    log "Frontend available at: http://localhost:3001" "${GREEN}"
fi

if [ "$FRONTEND_ONLY" = false ]; then
    log "API Gateway available at: http://localhost:8088" "${GREEN}"
    log "MySQL available at: localhost:3306" "${GREEN}"
    log "Redis available at: localhost:6379" "${GREEN}"
fi

log "To stop all services, run: ./stop.sh" "${YELLOW}" 