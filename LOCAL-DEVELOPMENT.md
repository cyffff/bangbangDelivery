# BangBang Delivery - Local Development Setup

## Quick Start

### Prerequisites
- Docker and Docker Compose installed
- At least 8GB RAM available for Docker
- Ports 3000, 6379, 8080-8085, 9200 available

### Start All Services
```bash
# Start all services in background
docker-compose -f docker-compose.local.yml up -d

# View logs of all services
docker-compose -f docker-compose.local.yml logs -f

# View logs of specific service
docker-compose -f docker-compose.local.yml logs -f auth-service
```

### Stop All Services
```bash
# Stop all services
docker-compose -f docker-compose.local.yml down

# Stop and remove volumes (clean slate)
docker-compose -f docker-compose.local.yml down -v
```

## Service Access Points

### Frontend & Gateway
- **Main Application**: http://localhost:8080 (through nginx gateway)
- **Direct Frontend**: http://localhost:3000 (direct React app)
- **API Gateway Health**: http://localhost:8080/health

### API Services (Direct Access)
- **Auth Service**: http://localhost:8081
- **User Service**: http://localhost:8082  
- **Order Service**: http://localhost:8083
- **Demand Service**: http://localhost:8084
- **Journey Service**: http://localhost:8085

### API Services (Through Gateway)
- **Auth API**: http://localhost:8080/api/auth/
- **User API**: http://localhost:8080/api/users/
- **Order API**: http://localhost:8080/api/orders/
- **Demand API**: http://localhost:8080/api/demands/
- **Journey API**: http://localhost:8080/api/journeys/

### Infrastructure Services
- **MySQL**: localhost:3306 (root password: `bangbangRoot123`)
- **Redis**: localhost:6379
- **Elasticsearch**: http://localhost:9200

## Database Configuration

### Default Database Credentials
- **Host**: localhost:3306
- **Database**: bangbang_db
- **Username**: bangbang_user
- **Password**: bangbang_pass
- **Root Password**: bangbangRoot123

### Connect to MySQL
```bash
# Using Docker
docker-compose -f docker-compose.local.yml exec mysql mysql -u bangbang_user -p bangbang_db

# Using local MySQL client
mysql -h localhost -P 3306 -u bangbang_user -p bangbang_db
```

## Development Workflow

### Build Specific Service
```bash
# Rebuild specific service
docker-compose -f docker-compose.local.yml build auth-service
docker-compose -f docker-compose.local.yml up -d auth-service

# Rebuild frontend only
docker-compose -f docker-compose.local.yml build frontend
docker-compose -f docker-compose.local.yml up -d frontend
```

### Check Service Health
```bash
# Check all container status
docker-compose -f docker-compose.local.yml ps

# Check specific service logs
docker-compose -f docker-compose.local.yml logs auth-service

# Follow logs in real-time
docker-compose -f docker-compose.local.yml logs -f user-service
```

### Debugging Services
```bash
# Execute commands in running container
docker-compose -f docker-compose.local.yml exec auth-service bash
docker-compose -f docker-compose.local.yml exec mysql bash
docker-compose -f docker-compose.local.yml exec redis redis-cli

# View container resource usage
docker stats
```

## Startup Sequence

Services start in dependency order:
1. **Infrastructure**: mysql, redis, elasticsearch
2. **Core Services**: auth-service
3. **Business Services**: user-service, order-service, demand-service, journey-service
4. **Frontend**: React application
5. **Gateway**: nginx proxy

## Troubleshooting

### Common Issues

**Port Conflicts**
```bash
# Check what's using ports
lsof -i :8080
lsof -i :3306

# Stop conflicting services
sudo service mysql stop
```

**Service Won't Start**
```bash
# Check service logs
docker-compose -f docker-compose.local.yml logs service-name

# Restart specific service
docker-compose -f docker-compose.local.yml restart service-name
```

**Database Connection Issues**
```bash
# Reset database
docker-compose -f docker-compose.local.yml down
docker volume rm bangbangdelivery_mysql_data
docker-compose -f docker-compose.local.yml up -d mysql
```

**Clean Start**
```bash
# Complete clean restart
docker-compose -f docker-compose.local.yml down -v
docker system prune -f
docker-compose -f docker-compose.local.yml up -d
```

### Performance Tips

- Allocate at least 8GB RAM to Docker
- Use SSD for Docker volumes
- Close unnecessary applications
- Monitor with `docker stats`

### Environment Variables

You can override default settings by creating a `.env` file:

```bash
# .env file
MYSQL_ROOT_PASSWORD=your_root_password
MYSQL_PASSWORD=your_app_password
JWT_SECRET=your-custom-jwt-secret
```

## API Testing

### Test API Gateway
```bash
# Gateway health
curl http://localhost:8080/health

# Auth service through gateway
curl http://localhost:8080/api/auth/health

# Direct service access
curl http://localhost:8081/actuator/health
```

### Sample API Calls
```bash
# User registration
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"password","email":"test@example.com"}'

# User login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"password"}'
```

This setup provides a complete local development environment for the BangBang Delivery platform with all microservices, databases, and frontend running in Docker containers. 