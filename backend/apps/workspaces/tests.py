from datetime import date, timedelta

from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase

from .models import Membership, Project, Task, Workspace


User = get_user_model()


class DashboardTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="owner", password="StrongPass123")
        self.client.force_authenticate(self.user)
        self.workspace = Workspace.objects.create(name="TaskForge", owner=self.user)
        Membership.objects.create(workspace=self.workspace, user=self.user, role=Membership.Role.ADMIN)
        self.project = Project.objects.create(
            workspace=self.workspace,
            name="Customer Portal",
            progress=72,
            start_date=date.today(),
            end_date=date.today() + timedelta(days=28),
        )
        Task.objects.create(
            project=self.project,
            title="Implement SSO",
            priority=Task.Priority.CRITICAL,
            due_date=date.today() + timedelta(days=2),
        )

    def test_dashboard_returns_workspace_data(self):
        response = self.client.get("/api/dashboard/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["workspace"]["slug"], "taskforge")
        self.assertEqual(response.data["metrics"]["project_count"], 1)

    def test_task_create_sets_reporter(self):
        response = self.client.post(
            "/api/tasks/",
            {
                "project": self.project.id,
                "title": "Release staging checklist",
                "description": "Prepare release handoff tasks.",
                "status": "todo",
                "priority": "medium",
                "story_points": 2,
                "tags": ["release"],
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["reporter"], self.user.id)
