#!/bin/bash

NAME=yclins-client

cp ../../pwa-ver.txt .

docker build -t $NAME .
docker rm -f $NAME
docker run --restart=always --network=apps -d -p 9000:80 --name $NAME $NAME
