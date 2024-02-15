#!/bin/sh

# stop and delete container
docker stop ed-speedtest-services-externalspeeds
docker rm ed-speedtest-services-externalspeeds

# delete image
docker image rm speedtest-services-externalspeeds

# pull latest image and run as container
docker build -t speedtest-services-externalspeeds .

docker run -dp 3002:3002 --name ed-speedtest-services-externalspeeds speedtest-services-externalspeeds 
