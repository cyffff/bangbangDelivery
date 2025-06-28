# BangBang Delivery - Kubernetes Deployment

This directory contains Kubernetes manifests for deploying the BangBang Delivery platform on Kubernetes.

## 📁 Directory Structure

```
k8s/
├── namespace.yaml              # Namespace definition
├── deploy.sh                   # Deployment script
├── cleanup.sh                  # Cleanup script
├── README.md                   # This file
├── secrets/                    # Secret manifests
│   ├── mysql-secret.yaml       # MySQL credentials
│   └── auth-secret.yaml        # JWT secrets
├── configmaps/                 # ConfigMap manifests
│   ├── mysql-init-configmap.yaml  # MySQL initialization scripts
│   └── nginx-config.yaml       # Nginx gateway configuration
├── database/                   # Database services
│   ├── mysql-deployment.yaml   # MySQL deployment
│   └── redis-deployment.yaml   # Redis deployment
├── backend/                    # Backend microservices
│   ├── auth-service.yaml       # Authentication service
│   ├── user-service.yaml       # User management service
│   ├── order-service.yaml      # Order management service
│   ├── demand-service.yaml     # Demand service (mock)
│   └── journey-service.yaml    # Journey service (mock)
├── frontend/                   # Frontend service
│   └── frontend-deployment.yaml # React frontend
└── gateway/                    # API Gateway
    └── gateway-deployment.yaml  # Nginx gateway with ingress
```

## 🚀 Prerequisites

1. **Kubernetes Cluster**: A running Kubernetes cluster (local or cloud)
2. **kubectl**: Kubernetes CLI tool configured to access your cluster
3. **Docker Images**: All service images must be available in your cluster
4. **Ingress Controller**: Nginx ingress controller (optional, for external access)
5. **Storage Class**: A default storage class for persistent volumes

## 📋 Pre-deployment Steps

### 1. Build and Push Docker Images

Before deploying, ensure all Docker images are built and available to your Kubernetes cluster:

```bash
# Build all images
docker-compose build

# If using a remote registry, tag and push images
docker tag bangbangdelivery-auth-service:latest your-registry/bangbangdelivery-auth-service:latest
docker tag bangbangdelivery-user-service:latest your-registry/bangbangdelivery-user-service:latest
docker tag bangbangdelivery-order-service:latest your-registry/bangbangdelivery-order-service:latest
docker tag bangbangdelivery-demand-service:latest your-registry/bangbangdelivery-demand-service:latest
docker tag bangbangdelivery-journey-service:latest your-registry/bangbangdelivery-journey-service:latest
docker tag bangbangdelivery-frontend:latest your-registry/bangbangdelivery-frontend:latest

# Push to registry
docker push your-registry/bangbangdelivery-auth-service:latest
# ... repeat for all images
```

### 2. Update Image References (if using remote registry)

If using a remote registry, update the image references in the deployment files:

```bash
# Example: Update all deployment files to use your registry
sed -i 's/bangbangdelivery-/your-registry\/bangbangdelivery-/g' k8s/backend/*.yaml
sed -i 's/bangbangdelivery-/your-registry\/bangbangdelivery-/g' k8s/frontend/*.yaml
```

### 3. Configure Storage Class (if needed)

Update the storage class in PVC manifests if your cluster uses a different storage class:

```bash
# Check available storage classes
kubectl get storageclass

# Update storage class in PVC manifests if needed
sed -i 's/storageClassName: standard/storageClassName: your-storage-class/g' k8s/database/*.yaml
```

## 🚀 Deployment

### Quick Deployment

```bash
# Make deployment script executable
chmod +x k8s/deploy.sh

# Deploy everything
./k8s/deploy.sh
```

### Manual Deployment

If you prefer to deploy manually:

```bash
# 1. Create namespace
kubectl apply -f k8s/namespace.yaml

# 2. Deploy secrets and configmaps
kubectl apply -f k8s/secrets/
kubectl apply -f k8s/configmaps/

# 3. Deploy databases
kubectl apply -f k8s/database/

# 4. Wait for databases to be ready
kubectl wait --for=condition=ready pod -l app=mysql -n bangbang --timeout=300s
kubectl wait --for=condition=ready pod -l app=redis -n bangbang --timeout=300s

# 5. Deploy backend services
kubectl apply -f k8s/backend/

# 6. Deploy frontend
kubectl apply -f k8s/frontend/

# 7. Deploy gateway
kubectl apply -f k8s/gateway/
```

## 🔍 Monitoring Deployment

### Check Pod Status
```bash
kubectl get pods -n bangbang
```

### Check Services
```bash
kubectl get services -n bangbang
```

### Check Ingress
```bash
kubectl get ingress -n bangbang
```

### View Logs
```bash
# View logs for a specific service
kubectl logs -l app=auth-service -n bangbang

# Follow logs
kubectl logs -f deployment/auth-service -n bangbang
```

## 🌐 Accessing the Application

### Via LoadBalancer (if supported)
```bash
# Get external IP
kubectl get service gateway -n bangbang

# Access via external IP
curl http://<EXTERNAL-IP>/api
```

### Via Ingress
```bash
# Get ingress IP
kubectl get ingress bangbang-ingress -n bangbang

# Add to /etc/hosts (if using hostname)
echo "<INGRESS-IP> bangbang.local" >> /etc/hosts

# Access via browser
open http://bangbang.local
```

### Via Port Forward (for testing)
```bash
# Port forward gateway service
kubectl port-forward service/gateway 8080:80 -n bangbang

# Access locally
open http://localhost:8080
```

## 🔧 Configuration

### Environment Variables

Key environment variables are configured in the deployment files:

- **Database URLs**: Point to internal Kubernetes services
- **JWT Secrets**: Stored in Kubernetes secrets
- **Service URLs**: Use Kubernetes DNS names

### Secrets

Secrets are base64 encoded in the secret manifests:

- `mysql-secret`: MySQL root and user passwords
- `auth-secret`: JWT signing secret

To update secrets:
```bash
echo -n "new-password" | base64
# Update the secret manifest with the new base64 value
kubectl apply -f k8s/secrets/mysql-secret.yaml
```

### Scaling

Scale services horizontally:
```bash
# Scale auth service to 3 replicas
kubectl scale deployment auth-service --replicas=3 -n bangbang

# Scale frontend to 5 replicas
kubectl scale deployment frontend --replicas=5 -n bangbang
```

## 🛠️ Troubleshooting

### Common Issues

1. **ImagePullBackOff**: Images not available in cluster
   - Solution: Build and push images to accessible registry

2. **PVC Pending**: No storage class or insufficient storage
   - Solution: Check storage class and cluster storage capacity

3. **Service Unavailable**: Dependencies not ready
   - Solution: Check pod logs and ensure databases are running

4. **Database Connection Errors**: Wrong connection strings
   - Solution: Verify service names and database URLs

### Debug Commands

```bash
# Describe pod for detailed information
kubectl describe pod <pod-name> -n bangbang

# Get events in namespace
kubectl get events -n bangbang --sort-by='.lastTimestamp'

# Execute into a pod
kubectl exec -it <pod-name> -n bangbang -- /bin/sh

# Check resource usage
kubectl top pods -n bangbang
kubectl top nodes
```

## 🧹 Cleanup

### Quick Cleanup
```bash
# Make cleanup script executable
chmod +x k8s/cleanup.sh

# Remove everything
./k8s/cleanup.sh
```

### Manual Cleanup
```bash
# Delete all resources in namespace
kubectl delete all --all -n bangbang

# Delete PVCs
kubectl delete pvc --all -n bangbang

# Delete configmaps and secrets
kubectl delete configmaps,secrets --all -n bangbang

# Delete namespace
kubectl delete namespace bangbang
```

## 📊 Resource Requirements

### Minimum Requirements
- **CPU**: 2 cores
- **Memory**: 4GB RAM
- **Storage**: 20GB persistent storage

### Recommended Requirements
- **CPU**: 4 cores
- **Memory**: 8GB RAM
- **Storage**: 50GB persistent storage

### Per Service Resources

| Service | CPU Request | CPU Limit | Memory Request | Memory Limit |
|---------|-------------|-----------|----------------|--------------|
| MySQL | 250m | 500m | 512Mi | 1Gi |
| Redis | 100m | 200m | 256Mi | 512Mi |
| Auth Service | 250m | 500m | 512Mi | 1Gi |
| User Service | 250m | 500m | 512Mi | 1Gi |
| Order Service | 250m | 500m | 512Mi | 1Gi |
| Demand Service | 100m | 250m | 256Mi | 512Mi |
| Journey Service | 100m | 250m | 256Mi | 512Mi |
| Frontend | 100m | 250m | 256Mi | 512Mi |
| Gateway | 50m | 100m | 128Mi | 256Mi |

## 🔐 Security Considerations

1. **Secrets Management**: Use Kubernetes secrets for sensitive data
2. **Network Policies**: Implement network policies for service isolation
3. **RBAC**: Configure role-based access control
4. **Image Security**: Scan images for vulnerabilities
5. **TLS**: Enable TLS for external traffic

## 📈 Production Considerations

1. **High Availability**: Deploy across multiple nodes/zones
2. **Monitoring**: Implement Prometheus/Grafana monitoring
3. **Logging**: Centralized logging with ELK stack
4. **Backup**: Regular database backups
5. **Auto-scaling**: Horizontal Pod Autoscaler (HPA)
6. **Resource Limits**: Set appropriate resource limits
7. **Health Checks**: Proper liveness and readiness probes

## 🤝 Contributing

When adding new services:

1. Create deployment and service manifests
2. Update the deployment script
3. Add resource requirements to this README
4. Test deployment in development environment

## 📞 Support

For deployment issues:
1. Check pod logs and events
2. Verify image availability
3. Ensure proper resource allocation
4. Check network connectivity between services 