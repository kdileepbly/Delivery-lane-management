from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    job_title = models.CharField(max_length=120, blank=True)
    bio = models.TextField(blank=True)
    avatar_url = models.URLField(blank=True)

    def __str__(self) -> str:
        return self.get_full_name() or self.username
