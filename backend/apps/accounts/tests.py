from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase


User = get_user_model()


class AuthTests(APITestCase):
    def test_user_can_register(self):
        response = self.client.post(
            reverse("register"),
            {
                "username": "demo",
                "email": "demo@example.com",
                "first_name": "Demo",
                "last_name": "User",
                "job_title": "Engineer",
                "password": "StrongPass123",
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(username="demo").exists())
