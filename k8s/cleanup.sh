#!/bin/bash

set -e

echo "🧹 Cleaning up BangBang Delivery from Kubernetes..."

# Delete all resources in the bangbang namespace
echo "🗑️ Deleting all resources..."
kubectl delete all --all -n bangbang

# Delete PVCs
echo "💾 Deleting persistent volume claims..."
kubectl delete pvc --all -n bangbang

# Delete configmaps and secrets
echo "🔐 Deleting configmaps and secrets..."
kubectl delete configmaps --all -n bangbang
kubectl delete secrets --all -n bangbang

# Delete ingress
echo "🔗 Deleting ingress..."
kubectl delete ingress --all -n bangbang

# Delete namespace
echo "📦 Deleting namespace..."
kubectl delete namespace bangbang

echo "✅ Cleanup completed successfully!"
echo "   All BangBang Delivery resources have been removed from Kubernetes." 