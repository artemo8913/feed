# Feed-backend


## Установка среды

```shell
python3 -m venv venv
. ./venv/bin/activate
pip install -r requirements.txt
```

### Установка настроек БД и т.д.
```shell
cp .env.sample .env
```

### Инициализация и первоначальное заполнение БД
```shell
./manage.py migrate
./manage.py loaddata colors feed_types kitchens
./manage.py createsuperuser
```

## Запуск сервера разработки

```shell
./manage.py runserver 127.0.0.1:8000
```

## Swagger UI

http://127.0.0.1:8000/api/v1/

http://127.0.0.1:8000/api/v1/redoc/

Swagger schema URL
http://127.0.0.1:8000/api/v1/schema/

## Admin UI

http://127.0.0.1:8000/admin/

Логин и пароль вводятся созданные ранее командой 
`./manage.py createsuperuser`
