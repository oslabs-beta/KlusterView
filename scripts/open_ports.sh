#Setting context
current_dir=$(pwd)
echo "current_dir is $current_dir"
parentdir="$(dirname "$current_dir")"
echo $parentdir

echo "Ensuring Prometheus deployment is ready..."
kubectl wait --for=condition=Ready pod/$(kubectl get pod -l app=prometheus-server -n monitoring -o jsonpath="{.items[0].metadata.name}") -n monitoring

echo "Forwarding Prometheus to Port 9999"
kubectl port-forward deployment/prometheus-deployment -n monitoring 9999:9090 &
printf "Prometheus running on Port 9999 with Process ID %s" $! > $parentdir/deployment/_temp/ppid.txt
echo $!

echo "Ensuring Grafana deployment is ready..."
kubectl wait --for=condition=Ready pod/$(kubectl get pod -l app=grafana -n monitoring -o jsonpath="{.items[0].metadata.name}") -n monitoring

echo "Forwarding Grafana to Port 9000"
kubectl port-forward deployment/grafana -n monitoring 9000:3000 &
printf "Grafana running on Port 9000 with Process ID %s" $! > $parentdir/deployment/_temp/gpid.txt
echo $!