#!/bin/bash

kubectl create deployment kuard --image=gcr.io/kuar-demo/kuard-amd64:blue
kubectl expose deployment kuard --type=NodePort --port=8080
kubectl port-forward service/kuard 8080:8080 &