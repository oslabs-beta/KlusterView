#!/bin/bash

#Setting context
current_dir=$(pwd)
echo "current_dir is $current_dir"
parentdir="$(dirname "$current_dir")"
echo $parentdir


echo "Ensuring namespace monitoring exists..."
kubectl delete namespace monitoring --ignore-not-found
kubectl create namespace monitoring

echo "Enabling Kube State Metrics..."
kubectl apply -f $parentdir/deployment/kube_state_metrics/

echo "Setting up Prometheus..."
kubectl apply -f $parentdir/deployment/prometheus/
# kubectl apply -f $parentdir/deployment/prometheus-service.yaml --namespace=monitoring

echo "Setting up Grafana..."
kubectl apply -f $parentdir/deployment/grafana/