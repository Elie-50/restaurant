from django.urls import reverse
from rest_framework import status
from auth.tests import BaseAuthAPITestCase
from helpers.tests import get_jwt_token
from users.models import User
from .models import DietaryPreference

class DietViewSetTest(BaseAuthAPITestCase):
    def setUp(self):
        super().setUp()
        self.diet_url = reverse('dietary-preferences-list')

        self.admin_user = User.objects.create_user(
            username="adminuser",
            email="admin@example.com",
            password="adminpassword123",
            is_superuser=True
        )

        self.diet_option = DietaryPreference.objects.create(label="Option 1")
    
    def test_list_reject_unauthenticated(self):
        response = self.client.get(self.diet_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_accept_authenticated_non_admin(self):
        token = get_jwt_token(self.existing_user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        response = self.client.get(self.diet_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_reject_non_admin_unsafe_methods(self):
        token = get_jwt_token(self.existing_user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        url = reverse("dietary-preferences-detail", args=[self.diet_option.id])

        payload = { "label": "Option B" }

        post_response = self.client.post(self.diet_url, payload)
        self.assertEqual(post_response.status_code, status.HTTP_403_FORBIDDEN)

        put_response = self.client.put(url, payload)
        self.assertEqual(put_response.status_code, status.HTTP_403_FORBIDDEN)

    def test_accept_admin_unsafe_methods(self):
        token = get_jwt_token(self.admin_user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        url = reverse("dietary-preferences-detail", args=[self.diet_option.id])

        payload = { "label": "Option B" }

        post_response = self.client.post(self.diet_url, payload)
        self.assertEqual(post_response.status_code, status.HTTP_201_CREATED)

        payload2 = { "label": "New Option" }
        put_response = self.client.put(url, payload2)
        self.assertEqual(put_response.status_code, status.HTTP_200_OK)

    def test_reject_duplicate_values(self):
        token = get_jwt_token(self.admin_user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        payload = { "label": "Option 1" }

        post_response = self.client.post(self.diet_url, payload)
        self.assertEqual(post_response.status_code, status.HTTP_400_BAD_REQUEST)