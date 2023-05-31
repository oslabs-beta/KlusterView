#!/bin/bash

kubectl create deployment kuard --image=gcr.io/kuar-demo/kuard-amd64:blue
kubectl expose deployment kuard --type=NodePort --port=8080
kubectl wait --for=condition=Ready pod/$(kubectl get pod -l app=kuard -n monitoring -o jsonpath="{.items[0].metadata.name}") -n monitoring
kubectl port-forward service/kuard 8080:8080 &