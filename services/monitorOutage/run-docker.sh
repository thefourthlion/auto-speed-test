#!/bin/sh

# stop and delete container
docker stop ed-speedtest-services-monitor
docker rm ed-speedtest-services-monitor

# delete image
docker image rm speedtest-services-monitor

# pull latest image and run as container
docker build -t speedtest-services-monitor .

docker run -dp 3003:3003 --name ed-speedtest-services-monitor speedtest-services-monitor 
