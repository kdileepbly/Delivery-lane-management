# Buyer Setup Guide

This guide is written for customers who purchase TaskForge as a starter kit.

## What the buyer receives

- Django REST backend
- React TypeScript frontend
- Demo seed command
- Docker setup
- Documentation for local setup and deployment

## Prerequisites

- Python 3.12, 3.13, or 3.14
- Node.js 20+
- npm 10+
- Git
- Docker Desktop optional

## Install locally

### Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
python manage.py migrate
python manage.py seed_demo
python manage.py runserver
```

If the project was previously installed with an older Django version, delete and recreate `.venv` before reinstalling requirements.

### Frontend

```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

## First login

- URL: `http://localhost:5173/login`
- Username: `demo.lead`
- Password: `StrongPass123`

## Suggested first customizations

- Change brand name and colors in `frontend/src/styles.css`
- Replace demo content using `python manage.py seed_demo` as a reference
- Add your logo and screenshots before resale or client delivery

## Support note for sellers

If you sell this package, include your own support policy, update cadence, and commercial terms with the download.
