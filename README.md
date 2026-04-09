# TaskForge

TaskForge is a professional-grade Django + React starter kit for GitHub portfolios and Gumroad sales. It simulates a modern delivery workspace where teams can track projects, manage execution boards, review activity, and monitor operational metrics.

## Why this project looks strong on GitHub

- Monorepo structure with clearly separated `backend` and `frontend`
- Django REST API with JWT-based authentication
- Custom user model and workspace/project/task domain design
- React + TypeScript frontend with a polished dashboard and kanban-style board
- Docker setup and environment templates for production-minded presentation
- Seed command for instant demo credentials
- Backend API tests for core flows
- Buyer-friendly account creation and task quick-create workflow
- Gumroad-ready documentation pack

## Tech Stack

- Backend: Django 5.2 LTS, Django REST Framework, Simple JWT, CORS Headers
- Frontend: React, TypeScript, Vite, Axios, Recharts
- Tooling: Docker, Docker Compose

## Product Modules

- Authentication
- Workspace overview dashboard
- Project portfolio summary
- Task execution board
- Collaboration activity feed
- Delivery analytics

## Folder Structure

```text
taskforge-pro/
  backend/
  frontend/
  docker-compose.yml
  README.md
```

## Local Setup

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

Python 3.14 note:

- Use the updated `requirements.txt` in this repo
- If your previous virtual environment was created with older package versions, recreate `.venv` before reinstalling dependencies

### Frontend

```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

## Docker Setup

```bash
docker compose up --build
```

After containers start, open:

- Frontend: `http://localhost:5173`
- Backend API: `http://127.0.0.1:8000/api`
- Admin: `http://127.0.0.1:8000/admin`

## Demo Credentials

- Username: `demo.lead`
- Password: `StrongPass123`

## Gumroad Package Assets

- [Buyer setup guide](C:\Users\Dileep Kumar\OneDrive\Desktop\CODEX\taskforge-pro\docs\BUYER-SETUP.md)
- [Deployment playbook](C:\Users\Dileep Kumar\OneDrive\Desktop\CODEX\taskforge-pro\docs\DEPLOYMENT.md)
- [Customization guide](C:\Users\Dileep Kumar\OneDrive\Desktop\CODEX\taskforge-pro\docs\CUSTOMIZATION.md)
- [Product copy](C:\Users\Dileep Kumar\OneDrive\Desktop\CODEX\taskforge-pro\docs\PRODUCT_COPY.md)
- [Commercial license template](C:\Users\Dileep Kumar\OneDrive\Desktop\CODEX\taskforge-pro\docs\COMMERCIAL-LICENSE.txt)

## Suggested GitHub Presentation

- Add screenshots of the dashboard and task board
- Write a short problem statement and feature list in the repo description
- Mention architecture decisions, auth flow, and responsive UI in your pinned README summary
- Record a 30-60 second demo video for extra impact

## API Highlights

- `POST /api/auth/register/`
- `POST /api/auth/login/`
- `GET /api/auth/me/`
- `GET /api/dashboard/`
- `GET /api/dashboard/overview/`
- `GET /api/dashboard/health/`
- `GET /api/projects/`
- `GET /api/tasks/`

## What to improve next

- Role-based permissions per endpoint
- Drag and drop task updates
- File attachments and comments
- CI/CD pipeline with GitHub Actions
- Deployment on Render, Railway, or AWS

## Python 3.14 Compatibility

This project is pinned to versions intended to support Python 3.14:

- Django `5.2.12`
- Django REST Framework `3.17.0`
- Simple JWT `5.5.1`
- django-cors-headers `4.9.0`

If you were previously using Django `5.1.2` on Python `3.14`, upgrading and rebuilding the virtual environment is recommended.

## Live Demo

[Open Live App](https://YOUR-FRONTEND-URL.onrender.com)

[Backend API](https://delivery-lane-management-2.onrender.com/api)

