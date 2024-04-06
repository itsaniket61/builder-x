#!/bin/bash

source docker.creds

docker login -u "${USERNAME}" -p "${PASSWORD}"

docker-compose pull builderx

docker-compose up -d