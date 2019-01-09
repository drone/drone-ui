#!/bin/bash

TAG=2

docker build -t laszlocloud/drone-ui:$TAG .

echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin
docker push laszlocloud/drone-ui:$TAG
