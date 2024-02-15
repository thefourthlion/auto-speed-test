#!/bin/sh

# stop and delete container
docker stop ed-speedtest-services-intspeeds
docker rm ed-speedtest-services-intspeeds

# delete image
docker image rm speedtest-services-intspeeds

# pull latest image and run as container
docker build -t speedtest-services-intspeeds .

docker run -dp 3001:3001 --name ed-speedtest-services-intspeeds speedtest-services-intspeeds 
