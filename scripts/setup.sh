#!/bin/bash

#Setting context
current_dir=$(pwd)
echo "current_dir is $current_dir"
parentdir="$(dirname "$current_dir")"
echo $parentdir


echo "Ensuring namespace monitoring-kv exists..."
kubectl create namespace monitoring-kv --dry-run=client -o yaml | kubectl apply -f -

echo "Enabling Kube State Metrics..."
kubectl apply -f $parentdir/deployment/_manual_install/kube_state_metrics/

echo "Setting up Prometheus..."
kubectl apply -f $parentdir/deployment/_manual_install/prometheus/

echo "Setting up Grafana..."
kubectl apply -f $parentdir/deployment/_manual_install/grafana/

echo "Setting up KlusterView..."
kubectl apply -f $parentdir/deployment/_manual_install/klusterview-manifest.yaml

