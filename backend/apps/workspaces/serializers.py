from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import Activity, Membership, Project, Task, Workspace


User = get_user_model()


class WorkspaceMemberSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ("id", "full_name", "email", "job_title", "avatar_url")

    def get_full_name(self, obj):
        return obj.get_full_name() or obj.username


class MembershipSerializer(serializers.ModelSerializer):
    user = WorkspaceMemberSerializer()

    class Meta:
        model = Membership
        fields = ("id", "role", "user")


class WorkspaceSerializer(serializers.ModelSerializer):
    memberships = MembershipSerializer(many=True, read_only=True)

    class Meta:
        model = Workspace
        fields = ("id", "name", "slug", "description", "memberships", "created_at")
        read_only_fields = ("slug", "memberships", "created_at")


class ProjectSerializer(serializers.ModelSerializer):
    workspace = serializers.SlugRelatedField(slug_field="slug", queryset=Workspace.objects.all())
    task_count = serializers.IntegerField(source="tasks.count", read_only=True)

    class Meta:
        model = Project
        fields = (
            "id",
            "workspace",
            "name",
            "description",
            "status",
            "progress",
            "start_date",
            "end_date",
            "task_count",
        )
        read_only_fields = ("task_count",)


class TaskSerializer(serializers.ModelSerializer):
    assignee_name = serializers.SerializerMethodField()
    project_name = serializers.CharField(source="project.name", read_only=True)
    reporter_name = serializers.SerializerMethodField()

    class Meta:
        model = Task
        fields = (
            "id",
            "project",
            "project_name",
            "title",
            "description",
            "status",
            "priority",
            "assignee",
            "assignee_name",
            "reporter",
            "reporter_name",
            "due_date",
            "story_points",
            "tags",
            "created_at",
        )
        read_only_fields = (
            "project_name",
            "assignee_name",
            "reporter",
            "reporter_name",
            "created_at",
        )

    def get_assignee_name(self, obj):
        if not obj.assignee:
            return None
        return obj.assignee.get_full_name() or obj.assignee.username

    def get_reporter_name(self, obj):
        if not obj.reporter:
            return None
        return obj.reporter.get_full_name() or obj.reporter.username


class ActivitySerializer(serializers.ModelSerializer):
    actor_name = serializers.SerializerMethodField()

    class Meta:
        model = Activity
        fields = ("id", "actor_name", "verb", "target", "metadata", "created_at")

    def get_actor_name(self, obj):
        return obj.actor.get_full_name() or obj.actor.username


class DashboardSerializer(serializers.Serializer):
    workspace = WorkspaceSerializer()
    projects = ProjectSerializer(many=True)
    tasks = TaskSerializer(many=True)
    activities = ActivitySerializer(many=True)
    metrics = serializers.DictField()
