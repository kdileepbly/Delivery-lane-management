# Deployment Playbook

TaskForge is structured so buyers can deploy quickly on common platforms.

## Backend deployment options

- Render web service
- Railway
- DigitalOcean App Platform
- AWS EC2 or ECS

## Frontend deployment options

- Vercel
- Netlify
- Render static site

## Recommended production adjustments

- Set `DJANGO_DEBUG=False`
- Replace SQLite with PostgreSQL
- Configure `DJANGO_ALLOWED_HOSTS`
- Set secure `DJANGO_SECRET_KEY`
- Enable HTTPS and secure cookies if session auth is added later
- Build frontend with production API URL

## Example release flow

1. Deploy backend API first.
2. Set frontend `VITE_API_BASE_URL`.
3. Build and deploy frontend.
4. Run migrations.
5. Seed demo data only for staging or demo environments.

## Recommended next improvements before client production

- Add PostgreSQL settings
- Add object-level permissions
- Add rate limiting
- Add background jobs and notifications
- Add CI pipeline for tests and build checks
