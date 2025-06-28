#!/bin/bash

set -e

echo "🚀 Deploying BangBang Delivery to Kubernetes..."

# Create namespace
echo "📦 Creating namespace..."
kubectl apply -f k8s/namespace.yaml

# Deploy secrets and configmaps first
echo "🔐 Deploying secrets and configmaps..."
kubectl apply -f k8s/secrets/
kubectl apply -f k8s/configmaps/

# Deploy database layer
echo "🗄️ Deploying database services..."
kubectl apply -f k8s/database/

# Wait for databases to be ready
echo "⏳ Waiting for MySQL to be ready..."
kubectl wait --for=condition=ready pod -l app=mysql -n bangbang --timeout=300s

echo "⏳ Waiting for Redis to be ready..."
kubectl wait --for=condition=ready pod -l app=redis -n bangbang --timeout=300s

# Deploy backend services
echo "🔧 Deploying backend services..."
kubectl apply -f k8s/backend/

# Wait for backend services to be ready
echo "⏳ Waiting for backend services to be ready..."
kubectl wait --for=condition=ready pod -l app=auth-service -n bangbang --timeout=300s
kubectl wait --for=condition=ready pod -l app=user-service -n bangbang --timeout=300s
kubectl wait --for=condition=ready pod -l app=order-service -n bangbang --timeout=300s
kubectl wait --for=condition=ready pod -l app=demand-service -n bangbang --timeout=300s
kubectl wait --for=condition=ready pod -l app=journey-service -n bangbang --timeout=300s

# Deploy frontend
echo "🌐 Deploying frontend..."
kubectl apply -f k8s/frontend/

# Deploy gateway
echo "🚪 Deploying gateway..."
kubectl apply -f k8s/gateway/

# Wait for frontend and gateway to be ready
echo "⏳ Waiting for frontend and gateway to be ready..."
kubectl wait --for=condition=ready pod -l app=frontend -n bangbang --timeout=300s
kubectl wait --for=condition=ready pod -l app=gateway -n bangbang --timeout=300s

echo "✅ Deployment completed successfully!"
echo ""
echo "📊 Checking deployment status:"
kubectl get pods -n bangbang
echo ""
echo "🌐 Services:"
kubectl get services -n bangbang
echo ""
echo "🔗 Ingress:"
kubectl get ingress -n bangbang
echo ""
echo "🎉 BangBang Delivery is now running on Kubernetes!"
echo "   Access the application via the LoadBalancer IP or Ingress"
echo "   To get the external IP: kubectl get service gateway -n bangbang" 