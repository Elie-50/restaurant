from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from users.models import User

class BaseAuthAPITestCase(APITestCase):
    def setUp(self):
        # Create a default user to test duplicate cases
        self.existing_user = User.objects.create_user(
            username="existinguser",
            email="existing@example.com",
            password="testpassword123",
            first_name="Existing",
            last_name="User"
        )
        self.signup_url = reverse("signup")
        self.login_url = reverse("login")


class SignUpViewTests(BaseAuthAPITestCase):
    def test_email_already_exists(self):
        payload = {
            "username": "newuser",
            "email": "existing@example.com",  # same email as existing user
            "password": "newpassword123",
            "first_name": "John",
            "last_name": "Doe"
        }
        response = self.client.post(self.signup_url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("error", response.data)
        self.assertEqual(response.data["error"], "User already exists")

    def test_username_already_exists(self):
        payload = {
            "username": "existinguser",  # same username as existing user
            "email": "unique@example.com",
            "password": "newpassword123",
            "first_name": "Jane",
            "last_name": "Smith"
        }
        response = self.client.post(self.signup_url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("error", response.data)
        self.assertEqual(response.data["error"], "User already exists")

    def test_required_fields_missing(self):
        payload = {
            "username": "",  # missing username
            "email": "unique@example.com",
            "password": "",  # missing password
        }
        response = self.client.post(self.signup_url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("error", response.data)
        self.assertEqual(response.data["error"], "Required fields cannot be empty")

    def test_successful_signup(self):
        payload = {
            "username": "newuser",
            "email": "newuser@example.com",
            "password": "securepassword123",
            "first_name": "New",
            "last_name": "User"
        }
        response = self.client.post(self.signup_url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("message", response.data)
        self.assertEqual(response.data["message"], "User created successfully")
        self.assertTrue(User.objects.filter(username="newuser").exists())

class LoginViewTests(BaseAuthAPITestCase):
    def test_login_invalid_credentials(self):
        payload = {
            "username": "existinguser",
            "password": "wrongpassword"
        }
        response = self.client.post(self.login_url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn("detail", response.data)
        self.assertEqual(response.data["detail"], "No active account found with the given credentials")

    def test_login_successful(self):
        payload = {
            "username": "existinguser",
            "password": "testpassword123"
        }
        response = self.client.post(self.login_url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)   # JWT access token
        self.assertIn("refresh", response.data)  # optional refresh token

        