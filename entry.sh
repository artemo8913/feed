#!/bin/sh

cd /app/packages/api
/app/node-modules/.bin/typeorm-extension seed
PORT=4000 /app/node_modules/.bin/nest start &

cd /app/packages/admin
PORT=4301 /app/node_modules/.bin/next start &

nginx
