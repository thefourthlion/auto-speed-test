#!/bin/sh

# stop and delete container
docker stop speedtest-services-email
docker rm speedtest-services-email

# delete image
docker image rm speedtest-services-email