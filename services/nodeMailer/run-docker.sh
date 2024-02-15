#!/bin/sh

docker build -t speedtest-services-email .

docker run -dp --name ed-speedtest-services-email 3004:3004 speedtest-services-email 
