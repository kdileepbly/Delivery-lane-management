from django.contrib import admin

from .models import Activity, Membership, Project, Task, Workspace


admin.site.register(Workspace)
admin.site.register(Membership)
admin.site.register(Project)
admin.site.register(Task)
admin.site.register(Activity)
