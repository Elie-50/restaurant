from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status

User = get_user_model()

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
        self.logout_url = reverse("logout")


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
        self.assertIn("error", response.data)
        self.assertEqual(response.data["error"], "Invalid credentials")

    def test_login_successful(self):
        payload = {
            "username": "existinguser",
            "password": "testpassword123"
        }
        response = self.client.post(self.login_url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("message", response.data)
        self.assertEqual(response.data["message"], "Logged in successfully")

        # Check session contains user id
        session = self.client.session
        self.assertIn('_auth_user_id', session)
        self.assertEqual(session['_auth_user_id'], str(self.existing_user.id))


class LogoutViewTests(BaseAuthAPITestCase):
    def test_logout_without_login(self):
        response = self.client.post(self.logout_url, {}, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["message"], "Logged out successfully")

    def test_logout_after_login(self):
        # First login
        payload = {
            "username": "existinguser",
            "password": "testpassword123"
        }
        login_response = self.client.post(self.login_url, payload, format="json")
        self.assertEqual(login_response.status_code, status.HTTP_200_OK)

        # Confirm session has user ID
        session = self.client.session
        self.assertIn('_auth_user_id', session)

        # Logout
        response = self.client.post(self.logout_url, {}, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["message"], "Logged out successfully")

        # Session should no longer have user ID
        session = self.client.session
        self.assertNotIn('_auth_user_id', session)

        