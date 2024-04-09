#!/bin/sh

# stop and delete container
docker stop ed-speedtest-client
docker rm ed-speedtest-client

# delete image
docker image rm speedtest-client

# pull latest image and run as container
docker build -t speedtest-client .

docker run -dp 4000:4000 --name ed-speedtest-client speedtest-client 
