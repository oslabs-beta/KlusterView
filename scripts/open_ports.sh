#Setting context
current_dir=$(pwd)
echo "current_dir is $current_dir"
parentdir="$(dirname "$current_dir")"
echo $parentdir

#Setting up directories and process files
mkdir -p $parentdir/deployment/_temp
touch $parentdir/deployment/_temp/prometheus_port_forward.pid
touch $parentdir/deployment/_temp/grafana_port_forward.pid


echo "Ensuring Prometheus deployment is ready..."
kubectl wait --for=condition=Ready pod/$(kubectl get pod -l app=prometheus-server -n monitoring -o jsonpath="{.items[0].metadata.name}") -n monitoring

echo "Forwarding Prometheus to Port 9999"
kubectl port-forward deployment/prometheus-deployment -n monitoring 9999:9090 &
echo $! > $parentdir/deployment/_temp/prometheus_port_forward.pid


echo "Ensuring Grafana deployment is ready..."
kubectl wait --for=condition=Ready pod/$(kubectl get pod -l app=grafana -n monitoring -o jsonpath="{.items[0].metadata.name}") -n monitoring

echo "Forwarding Grafana to Port 9000"
kubectl port-forward deployment/grafana -n monitoring 9000:3000 &
echo $! > $parentdir/deployment/_temp/grafana_port_forward.pid
