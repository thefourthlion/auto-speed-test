#!/bin/sh

# stop and delete container
docker stop ed-speedtest-server
docker rm ed-speedtest-server

# delete image
docker image rm speedtest-server

# pull latest image and run as container
docker build -t speedtest-server .

docker run -dp 4001:4001 --name ed-speedtest-server speedtest-server 
