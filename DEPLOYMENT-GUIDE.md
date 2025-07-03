# BangBang Delivery Platform - Manual Deployment Guide

## Overview
This guide provides step-by-step instructions for deploying the BangBang Delivery platform on a remote Kubernetes (k3s) cluster.

## Prerequisites
- Remote machine with k3s installed
- SSH access: `bb="ssh -i ~/.ssh/gcp_vm_key test@34.165.58.150"`
- Docker Hub account: yunf66

## Deployment Workflow

### Step 1: Connect to Remote Machine
```bash
# Use the provided alias
bb
```

### Step 2: Pull Latest Docker Images
```bash
# Pull all optimized images from Docker Hub
sudo docker pull yunf66/bangbang-auth-service:latest
sudo docker pull yunf66/bangbang-demand-service:latest  
sudo docker pull yunf66/bangbang-journey-service:latest

# Verify image sizes (should be small and optimized)
sudo docker images | grep yunf66/bangbang
```

### Step 3: Deploy Infrastructure Services
```bash
# Create namespace
kubectl apply -f k8s/namespace.yaml

# Deploy MySQL database
kubectl apply -f k8s/database/mysql-deployment.yaml

# Deploy Redis cache
kubectl apply -f k8s/database/redis-deployment.yaml

# Wait for infrastructure to be ready
kubectl get pods -n bangbang -w
```

### Step 4: Deploy Backend Services
```bash
# Deploy auth-service (image: yunf66/bangbang-auth-service:latest, ~271MB)
kubectl apply -f k8s/backend/auth-service.yaml

# Deploy demand-service (image: yunf66/bangbang-demand-service:latest, ~220MB)  
kubectl apply -f k8s/backend/demand-service.yaml

# Deploy journey-service (image: yunf66/bangbang-journey-service:latest, ~417MB)
kubectl apply -f k8s/backend/journey-service.yaml

# Verify all services are running
kubectl get pods -n bangbang
kubectl get services -n bangbang
```

### Step 5: Deploy Gateway
```bash
# Deploy nginx gateway
kubectl apply -f k8s/gateway/gateway-deployment.yaml

# Check gateway is accessible
kubectl get services -n bangbang | grep gateway
```

### Step 6: Verify Deployment
```bash
# Check all pods are running (should show 1/1 replicas for each service)
kubectl get pods -n bangbang

# Test service endpoints
kubectl port-forward -n bangbang service/gateway 8080:80 &

# Test in another terminal or use curl
curl http://localhost:8080/health
```

## Service Details

### Optimized Images (Small Size)
- **auth-service**: `yunf66/bangbang-auth-service:latest` (~271MB)
- **demand-service**: `yunf66/bangbang-demand-service:latest` (~220MB)  
- **journey-service**: `yunf66/bangbang-journey-service:latest` (~417MB)

### Replica Configuration
- All services configured with **1 replica** as requested
- No horizontal scaling configured

### Service Ports
- **auth-service**: 8081
- **demand-service**: 8084
- **journey-service**: 8085
- **gateway**: 80 (external access via NodePort 30080)

## Monitoring and Maintenance

### Check Service Status
```bash
# View all deployments
kubectl get deployments -n bangbang

# Check service logs
kubectl logs -f deployment/auth-service -n bangbang
kubectl logs -f deployment/demand-service -n bangbang
kubectl logs -f deployment/journey-service -n bangbang
```

### Update Services
```bash
# When new images are pushed to Docker Hub, restart deployments
kubectl rollout restart deployment/auth-service -n bangbang
kubectl rollout restart deployment/demand-service -n bangbang
kubectl rollout restart deployment/journey-service -n bangbang
```

### Clean Up (if needed)
```bash
# Remove all services
kubectl delete namespace bangbang
```

## Troubleshooting

### Common Issues
1. **Image Pull Errors**: Ensure Docker Hub images are public or credentials are configured
2. **Pod Restart Loops**: Check logs with `kubectl logs pod-name -n bangbang`
3. **Service Not Accessible**: Verify NodePort configuration and firewall rules

### Health Checks
- **auth-service**: Returns 401 (expected for secured endpoint)
- **demand-service**: `/actuator/health` should return 200
- **journey-service**: `/actuator/health` should return 200

## Architecture Summary
- **Internet Access**: Only gateway exposed on port 30080
- **Internal Communication**: All services communicate internally within k8s cluster
- **Database**: MySQL with shared bangbang_db database
- **Caching**: Redis for session and data caching
- **Scalability**: 1 replica per service (as requested)

## Next Steps
1. Configure domain name pointing to remote machine IP
2. Set up SSL/TLS certificates for HTTPS
3. Configure monitoring and logging
4. Set up backup strategy for MySQL data 