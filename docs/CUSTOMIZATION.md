# Customization Guide

TaskForge is intentionally structured as a starter product so sellers and buyers can adapt it to multiple niches.

## Easy customization angles

- Agency project tracker
- Internal team operations dashboard
- Startup sprint planner
- Client delivery portal
- SaaS admin cockpit

## Branding files

- `frontend/src/styles.css`
- `frontend/index.html`
- `frontend/src/components/layout/AppShell.tsx`
- `frontend/src/pages/LoginPage.tsx`

## Domain model extension ideas

- Add comments on tasks
- Add attachments
- Add notifications
- Add workspace invitations
- Add invoice or billing modules
- Add CRM or leads module

## Backend extension points

- `backend/apps/accounts/`
- `backend/apps/workspaces/models.py`
- `backend/apps/workspaces/views.py`
- `backend/apps/workspaces/serializers.py`

## Frontend extension points

- `frontend/src/pages/TasksPage.tsx`
- `frontend/src/pages/DashboardPage.tsx`
- `frontend/src/components/tasks/KanbanBoard.tsx`

## Selling tip

If you want higher conversion on Gumroad, sell this in tiers:

- Starter: source code only
- Pro: source code + deployment help docs
- Agency: white-label customization bonus
