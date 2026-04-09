from datetime import timedelta

from django.db.models import Avg, Count, Q
from django.utils import timezone
from rest_framework import mixins, permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Activity, Membership, Project, Task, Workspace
from .serializers import (
    DashboardSerializer,
    ProjectSerializer,
    TaskSerializer,
    WorkspaceSerializer,
)


class WorkspaceScopedMixin:
    def accessible_workspaces(self):
        return Workspace.objects.filter(
            Q(owner=self.request.user) | Q(memberships__user=self.request.user)
        ).distinct()


class WorkspaceViewSet(WorkspaceScopedMixin, viewsets.ModelViewSet):
    serializer_class = WorkspaceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return self.accessible_workspaces().prefetch_related("memberships__user")

    def perform_create(self, serializer):
        workspace = serializer.save(owner=self.request.user)
        Membership.objects.get_or_create(
            workspace=workspace,
            user=self.request.user,
            defaults={"role": Membership.Role.ADMIN},
        )


class ProjectViewSet(WorkspaceScopedMixin, viewsets.ModelViewSet):
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = Project.objects.filter(workspace__in=self.accessible_workspaces()).distinct()
        workspace_slug = self.request.query_params.get("workspace")
        if workspace_slug:
            queryset = queryset.filter(workspace__slug=workspace_slug)
        return queryset.select_related("workspace")

    def perform_create(self, serializer):
        workspace = serializer.validated_data["workspace"]
        if not self.accessible_workspaces().filter(pk=workspace.pk).exists():
            raise permissions.PermissionDenied("You do not have access to this workspace.")
        serializer.save()


class TaskViewSet(WorkspaceScopedMixin, viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = Task.objects.filter(project__workspace__in=self.accessible_workspaces()).distinct()
        project_id = self.request.query_params.get("project")
        status_value = self.request.query_params.get("status")
        priority_value = self.request.query_params.get("priority")
        if project_id:
            queryset = queryset.filter(project_id=project_id)
        if status_value:
            queryset = queryset.filter(status=status_value)
        if priority_value:
            queryset = queryset.filter(priority=priority_value)
        return queryset.select_related("project", "assignee", "reporter")

    def perform_create(self, serializer):
        project = serializer.validated_data["project"]
        if not self.accessible_workspaces().filter(pk=project.workspace_id).exists():
            raise permissions.PermissionDenied("You do not have access to this project.")
        task = serializer.save(reporter=self.request.user)
        Activity.objects.create(
            workspace=project.workspace,
            actor=self.request.user,
            verb="created task",
            target=task.title,
            metadata={"project": project.name},
        )

    def perform_update(self, serializer):
        task = serializer.save()
        Activity.objects.create(
            workspace=task.project.workspace,
            actor=self.request.user,
            verb="updated task",
            target=task.title,
            metadata={"status": task.status},
        )


class DashboardViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    serializer_class = DashboardSerializer
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request, *args, **kwargs):
        workspace = (
            Workspace.objects.filter(Q(owner=request.user) | Q(memberships__user=request.user))
            .distinct()
            .prefetch_related("memberships__user")
            .first()
        )
        if workspace is None:
            return Response({"detail": "No workspace found for this user."}, status=404)

        projects = Project.objects.filter(workspace=workspace)
        tasks = Task.objects.filter(project__workspace=workspace).select_related("project", "assignee", "reporter")
        activities = Activity.objects.filter(workspace=workspace)[:6]

        metrics = {
            "project_count": projects.count(),
            "active_projects": projects.filter(status=Project.Status.ACTIVE).count(),
            "completion_rate": round(
                projects.aggregate(avg_progress=Avg("progress"))["avg_progress"] or 0
            ),
            "open_tasks": tasks.exclude(status=Task.Status.DONE).count(),
            "tasks_due_soon": tasks.filter(
                status__in=[Task.Status.TODO, Task.Status.IN_PROGRESS],
                due_date__lte=timezone.localdate() + timedelta(days=7),
            ).count(),
            "critical_tasks": tasks.filter(priority=Task.Priority.CRITICAL).count(),
        }

        payload = {
            "workspace": workspace,
            "projects": projects,
            "tasks": tasks[:12],
            "activities": activities,
            "metrics": metrics,
        }
        serializer = self.get_serializer(payload)
        return Response(serializer.data)

    @action(detail=False, methods=["get"])
    def overview(self, request):
        task_breakdown = (
            Task.objects.filter(
                Q(project__workspace__owner=request.user)
                | Q(project__workspace__memberships__user=request.user)
            )
            .values("status")
            .annotate(total=Count("id"))
            .order_by("status")
        )
        return Response(list(task_breakdown))

    @action(detail=False, methods=["get"], permission_classes=[permissions.AllowAny])
    def health(self, request):
        return Response({"status": "ok"}, status=status.HTTP_200_OK)
