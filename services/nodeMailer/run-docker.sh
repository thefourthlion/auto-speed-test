#!/bin/sh

# stop and delete container
docker stop ed-speedtest-services-email
docker rm ed-speedtest-services-email

# delete image
docker image rm speedtest-services-email

# pull latest image and run as container
docker build -t speedtest-services-email .

docker run -dp 3004:3004 --name ed-speedtest-services-email speedtest-services-email 
