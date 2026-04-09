from django.contrib import admin
from django.urls import include, path
from rest_framework.routers import DefaultRouter

from apps.workspaces.views import DashboardViewSet, ProjectViewSet, TaskViewSet, WorkspaceViewSet


router = DefaultRouter()
router.register("workspaces", WorkspaceViewSet, basename="workspace")
router.register("projects", ProjectViewSet, basename="project")
router.register("tasks", TaskViewSet, basename="task")
router.register("dashboard", DashboardViewSet, basename="dashboard")

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/auth/", include("apps.accounts.urls")),
    path("api/", include(router.urls)),
]
