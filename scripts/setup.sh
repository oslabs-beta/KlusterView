#!/bin/bash

#Setting context
current_dir=$(pwd)
echo "current_dir is $current_dir"
parentdir="$(dirname "$current_dir")"
echo $parentdir


echo "Ensuring namespace monitoring exists..."
kubectl apply namespace monitoring

echo "Setting up Prometheus..."
kubectl apply -f $parentdir/deployment/clusterRole.yaml
kubectl apply -f $parentdir/deployment/config-map.yaml
kubectl apply  -f $parentdir/deployment/prometheus-deployment.yaml 
kubectl apply -f $parentdir/deployment/prometheus-service.yaml --namespace=monitoring

echo "Setting up Grafana..."
kubectl apply -f $parentdir/deployment/grafana-datasource-config.yaml
kubectl apply -f $parentdir/deployment/deployment.yaml
kubectl apply -f $parentdir/deployment/service.yaml