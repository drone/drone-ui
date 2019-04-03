#!/bin/bash

TAG=2.0.1-beta

docker build -t laszlocloud/drone-ui:$TAG .

echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin
docker push laszlocloud/drone-ui:$TAG
