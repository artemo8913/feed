#!/bin/sh

cd /app/packages/api
rm -rf /app/packages/api/_db/*
/app/node_modules/.bin/typeorm-seeding seed -c ./seed.js
PORT=4262 /app/node_modules/.bin/nest start &

cd /app/packages/admin
PORT=4301 /app/node_modules/.bin/next start &

cd /app/backend
./manage.py migrate
./manage.py shell < create_user.py
./manage.py loaddata colors feed_types kitchens
./manage.py runserver localhost:8000 &

sleep 2
curl -X 'POST' 'http://localhost:8000/api/v1/notion-sync' -H 'Authorization: K-PIN-CODE 111'

nginx
