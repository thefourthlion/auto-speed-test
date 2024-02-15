#!/bin/sh

docker build -t speedtest-services-email .

docker run -dp 3004:3004 speedtest-services-email 
