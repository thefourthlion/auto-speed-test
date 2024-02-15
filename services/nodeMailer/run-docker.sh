#!/bin/sh

# pull latest image and run as container
docker build -t speedtest-services-email .

docker run -dp 3004:3004 --name ed-speedtest-services-email speedtest-services-email 
