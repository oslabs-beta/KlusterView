#!/bin/bash

kubectl delete service klusterview -n monitoring-kv
kubectl delete deployment klusterview -n monitoring-kv
kubectl apply -f ../klusterview_manifest.yaml