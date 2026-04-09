#!/bin/sh
set -e

python manage.py migrate
python manage.py seed_demo
python manage.py runserver 0.0.0.0:${PORT:-8000} --noreload
