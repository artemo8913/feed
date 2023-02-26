#!/bin/sh

cd /app/packages/api
rm -rf /app/_db/*
/app/node_modules/.bin/typeorm-seeding seed -c ./seed.js
PORT=4262 /app/node_modules/.bin/nest start &

cd /app/packages/admin
PORT=4301 /app/node_modules/.bin/next start &

nginx
