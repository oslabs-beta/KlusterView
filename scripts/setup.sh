#!/bin/bash

#Setting context
current_dir=$(pwd)
echo "current_dir is $current_dir"
parentdir="$(dirname "$current_dir")"
echo $parentdir


echo "Ensuring namespace monitoring-kv exists..."
#kubectl delete namespace monitoring-kv --ignore-not-found
kubectl create namespace monitoring-kv --dry-run=client -o yaml | kubectl apply -f -

echo "Enabling Kube State Metrics..."
kubectl apply -f $parentdir/deployment/kube_state_metrics/

echo "Setting up Prometheus..."
kubectl apply -f $parentdir/deployment/prometheus/
# kubectl apply -f $parentdir/deployment/prometheus-service.yaml --namespace=monitoring

echo "Setting up Grafana..."
kubectl apply -f $parentdir/deployment/grafana/

echo "Setting up AlertManager..."
kubectl apply -f $parentdir/deployment/alerts/