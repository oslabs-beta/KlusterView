#!/bin/bash

#Setting context
current_dir=$(pwd)
echo "current_dir is $current_dir"
parentdir="$(dirname "$current_dir")"
echo $parentdir

echo "Setting up Prometheus..."
#Delete namespace if it exists
kubectl delete namespace monitoring --ignore-not-found

kubectl create namespace monitoring
kubectl apply -f $current_dir/deployment/clusterRole.yaml
kubectl apply -f $current_dir/deployment/config-map.yaml
kubectl apply  -f $current_dir/deployment/prometheus-deployment.yaml 
kubectl apply -f $current_dir/deployment/prometheus-service.yaml --namespace=monitoring

echo "Waiting for Prometheus deployment to be ready..."
kubectl wait --for=condition=Ready pod/$(kubectl get pod -l app=prometheus-server -n monitoring -o jsonpath="{.items[0].metadata.name}") -n monitoring

echo "Forwarding Prometheus to Port 9999"
kubectl port-forward deployment/prometheus-deployment -n monitoring 9999:9090 &
printf "Prometheus running on Port 9999 with Process ID %s" $! > $current_dir/deployment/_temp/ppid.txt
echo $!

#kubectl get deployments --namespace=monitoring
#kubectl get pods --namespace=monitoring

echo "Setting up Grafana..."

kubectl apply -f $current_dir/deployment/grafana-datasource-config.yaml
kubectl apply -f $current_dir/deployment/deployment.yaml
kubectl apply -f $current_dir/deployment/service.yaml

echo "Waiting for Prometheus deployment to be ready..."
kubectl wait --for=condition=Ready pod/$(kubectl get pod -l app=grafana -n monitoring -o jsonpath="{.items[0].metadata.name}") -n monitoring

echo "Forwarding Grafana to Port 9000"
kubectl port-forward deployment/grafana -n monitoring 9000:3000 &
printf "Grafana running on Port 9000 with Process ID %s" $! > $current_dir/deployment/_temp/gpid.txt
echo $!

#$(kubectl get pod -l app=grafana -n monitoring -o jsonpath="{.items[0].metadata.name}")


#kubectl port-forward --daemonize --ports-file=service-foo-portname.json --ports-file-format=json service/foo :portname






