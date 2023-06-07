#!/bin/bash

#Setting context
current_dir=$(pwd)
echo "current_dir is $current_dir"
parentdir="$(dirname "$current_dir")"
echo $parentdir

echo "Killing Grafana forwarding..."
ps -ef | grep kubectl | grep port-forward | grep graf | awk '{print $2}' | xargs -r kill -9

echo "Killing Prom forwarding..."
ps -ef | grep kubectl | grep port-forward | grep prom | awk '{print $2}' | xargs -r kill -9
