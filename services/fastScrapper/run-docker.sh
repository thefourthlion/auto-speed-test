#!/bin/sh

# stop and delete container
docker stop ed-speedtest-services-fast
docker rm ed-speedtest-services-fast

# delete image
docker image rm speedtest-services-fast

# pull latest image and run as container
docker build -t speedtest-services-fast .

docker run -dp 3005:3005 --name ed-speedtest-services-fast speedtest-services-fast 
