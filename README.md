# feed monorepo


## setup

```bash
echo -e "\n127.0.0.1\\tlocalhost.dev" | sudo tee -a /etc/hosts
cd local-dev
BUILDKIT_PROGRESS=plain docker-compose build
docker-compose up
#docker network inspect local-dev_default | grep Gateway
```


# Установка
```bash
yarn run bootstrap
```

# Запуск

```bash
cd ./backend
python3 -m venv venv
. ./venv/bin/activate
./manage.py migrate
./manage.py loaddata colors feed_types kitchens
./manage.py runserver localhost:8000
```

```bash
cd ./packages/api
# yarn run _db:drop
# yarn run db:seed
yarn run db:sync
yarn run dev
```

```bash
cd ./packages/admin
yarn run dev
```

```bash
cd ./packages/scanner
yarn run dev
```

## Admin

```bash
admin / admin
```

# Сборка

```bash
yarn run build
```
