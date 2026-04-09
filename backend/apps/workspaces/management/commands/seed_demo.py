from datetime import timedelta

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand
from django.utils import timezone

from apps.workspaces.models import Activity, Membership, Project, Task, Workspace


User = get_user_model()


class Command(BaseCommand):
    help = "Seed a polished demo workspace for TaskForge."

    def handle(self, *args, **options):
        demo_user, _ = User.objects.get_or_create(
            username="demo.lead",
            defaults={
                "email": "demo@taskforge.dev",
                "first_name": "Aarav",
                "last_name": "Mehta",
                "job_title": "Product Delivery Lead",
            },
        )
        demo_user.set_password("StrongPass123")
        demo_user.save()

        workspace, _ = Workspace.objects.get_or_create(
            slug="taskforge-labs",
            defaults={
                "name": "TaskForge Labs",
                "description": "Cross-functional delivery workspace for launching customer-facing product initiatives.",
                "owner": demo_user,
            },
        )
        Membership.objects.get_or_create(workspace=workspace, user=demo_user, role=Membership.Role.ADMIN)

        teammates = [
            ("riya.pm", "Riya", "Kapoor", "Program Manager"),
            ("kabir.ui", "Kabir", "Shah", "Product Designer"),
            ("naina.fe", "Naina", "Verma", "Frontend Engineer"),
        ]
        member_users = []
        for username, first_name, last_name, job_title in teammates:
            user, _ = User.objects.get_or_create(
                username=username,
                defaults={
                    "email": f"{username}@taskforge.dev",
                    "first_name": first_name,
                    "last_name": last_name,
                    "job_title": job_title,
                },
            )
            user.set_password("StrongPass123")
            user.save()
            Membership.objects.get_or_create(workspace=workspace, user=user, role=Membership.Role.MEMBER)
            member_users.append(user)

        today = timezone.localdate()
        portal, _ = Project.objects.get_or_create(
            workspace=workspace,
            name="Enterprise Customer Portal",
            defaults={
                "description": "Self-serve client operations hub with analytics, approvals, and support workflows.",
                "status": Project.Status.ACTIVE,
                "progress": 78,
                "start_date": today - timedelta(days=24),
                "end_date": today + timedelta(days=18),
            },
        )
        onboarding, _ = Project.objects.get_or_create(
            workspace=workspace,
            name="Partner Onboarding Automation",
            defaults={
                "description": "Automated intake and readiness engine for channel partners.",
                "status": Project.Status.REVIEW,
                "progress": 92,
                "start_date": today - timedelta(days=36),
                "end_date": today + timedelta(days=5),
            },
        )

        seed_tasks = [
            {
                "project": portal,
                "title": "Finalize SSO and RBAC policy mapping",
                "description": "Support enterprise client provisioning with scoped workspace roles.",
                "status": Task.Status.IN_PROGRESS,
                "priority": Task.Priority.CRITICAL,
                "assignee": member_users[2],
                "reporter": demo_user,
                "due_date": today + timedelta(days=3),
                "story_points": 8,
                "tags": ["security", "backend"],
            },
            {
                "project": portal,
                "title": "Polish billing insights dashboard",
                "description": "Add anomaly callouts and cohort filters for finance stakeholders.",
                "status": Task.Status.REVIEW,
                "priority": Task.Priority.HIGH,
                "assignee": member_users[1],
                "reporter": demo_user,
                "due_date": today + timedelta(days=4),
                "story_points": 5,
                "tags": ["ui", "analytics"],
            },
            {
                "project": portal,
                "title": "Prepare onboarding checklist migration",
                "description": "Map legacy tasks into configurable workflow templates.",
                "status": Task.Status.TODO,
                "priority": Task.Priority.MEDIUM,
                "assignee": member_users[0],
                "reporter": demo_user,
                "due_date": today + timedelta(days=6),
                "story_points": 3,
                "tags": ["ops"],
            },
            {
                "project": onboarding,
                "title": "Close legal review feedback",
                "description": "Resolve revised partner agreement approval notes.",
                "status": Task.Status.DONE,
                "priority": Task.Priority.HIGH,
                "assignee": demo_user,
                "reporter": member_users[0],
                "due_date": today - timedelta(days=1),
                "story_points": 2,
                "tags": ["compliance"],
            },
        ]

        for task in seed_tasks:
            Task.objects.get_or_create(project=task["project"], title=task["title"], defaults=task)

        activities = [
            (demo_user, "updated sprint goals for", portal.name),
            (member_users[0], "moved task into review on", portal.name),
            (member_users[1], "shared new UX handoff for", portal.name),
            (member_users[2], "completed integration notes on", onboarding.name),
        ]
        for actor, verb, target in activities:
            Activity.objects.get_or_create(
                workspace=workspace,
                actor=actor,
                verb=verb,
                target=target,
            )

        self.stdout.write(self.style.SUCCESS("Demo workspace seeded successfully."))
