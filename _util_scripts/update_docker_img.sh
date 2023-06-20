#!/bin/bash
sudo docker build . -t kyleslugg/klusterview
sudo docker push kyleslugg/klusterview:latest
echo "Pushed updated image to kyleslugg/klusterview"

sudo docker build . -t kyleslugg/klusterview-dev -f Dockerfile-dev
sudo docker push kyleslugg/klusterview-dev:latest
echo "Pushed updated image to kyleslugg/klusterview-dev"