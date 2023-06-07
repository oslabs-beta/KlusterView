#Setting context
current_dir=$(pwd)
echo "current_dir is $current_dir"
parentdir="$(dirname "$current_dir")"
echo $parentdir


echo "Ensuring Prometheus deployment is ready..."
kubectl wait --for=condition=Ready pod/$(kubectl get pod -l app=prometheus-server -n monitoring-kv -o jsonpath="{.items[0].metadata.name}") -n monitoring-kv

echo "Forwarding Prometheus to Port 9999"
kubectl port-forward deployment/prometheus-deployment -n monitoring-kv 9999:9090 &


echo "Ensuring Grafana deployment is ready..."
kubectl wait --for=condition=Ready pod/$(kubectl get pod -l app=grafana -n monitoring-kv -o jsonpath="{.items[0].metadata.name}") -n monitoring-kv

echo "Forwarding Grafana to Port 9000"
kubectl port-forward deployment/grafana -n monitoring-kv 9000:3000 &

