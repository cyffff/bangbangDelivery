#!/bin/bash

# Colors for better visibility
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Print with timestamp
log() {
    echo -e "${2}[$(date +"%Y-%m-%d %H:%M:%S")] $1${NC}"
}

log "Stopping BangBang Delivery Platform..." "${YELLOW}"

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
      log "Usage: ./stop.sh [--frontend-only] [--backend-only]" "${YELLOW}"
      exit 1
      ;;
  esac
  shift
done

# Stop services based on parameters
if [ "$FRONTEND_ONLY" = true ]; then
    log "Stopping frontend services only..." "${YELLOW}"
    docker-compose stop frontend
elif [ "$BACKEND_ONLY" = true ]; then
    log "Stopping backend services only..." "${YELLOW}"
    docker-compose stop mysql redis gateway auth-service user-service order-service demand-service journey-service payment-service messaging-service notification-service search-service
else
    log "Stopping all services..." "${YELLOW}"
    docker-compose down
fi

# Display successful result
log "Services stopped successfully!" "${GREEN}"
log "To start services again, run: ./start.sh" "${GREEN}" 