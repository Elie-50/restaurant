from django.urls import reverse
from rest_framework import status
from auth.tests import BaseAuthAPITestCase

class MeViewTests(BaseAuthAPITestCase):
    def setUp(self):
        super().setUp()
        self.me_url = reverse("me")

    # -------------------- GET /me/ --------------------
    def test_get_me_unauthenticated(self):
        response = self.client.get(self.me_url, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_get_me_authenticated(self):
        # Login first
        self.client.force_login(self.existing_user)
        response = self.client.get(self.me_url, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.data
        self.assertEqual(data["id"], str(self.existing_user.id))
        self.assertEqual(data["username"], self.existing_user.username)
        self.assertEqual(data["email"], self.existing_user.email)

    # -------------------- PUT /me/ --------------------
    def test_put_me_unauthenticated(self):
        payload = {"first_name": "Updated", "last_name": "Name"}
        response = self.client.put(self.me_url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_put_me_authenticated_valid_data(self):
        self.client.force_login(self.existing_user)
        payload = {
            "first_name": "UpdatedFirst",
            "last_name": "UpdatedLast",
            "phone_number": "1234567890",
        }
        response = self.client.put(self.me_url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.data
        self.assertEqual(data["first_name"], payload["first_name"])
        self.assertEqual(data["last_name"], payload["last_name"])
        self.assertEqual(data["phone_number"], payload["phone_number"])

        # Refresh from DB to confirm
        self.existing_user.refresh_from_db()
        self.assertEqual(self.existing_user.first_name, payload["first_name"])
        self.assertEqual(self.existing_user.last_name, payload["last_name"])
        self.assertEqual(self.existing_user.phone_number, payload["phone_number"])

    def test_put_me_authenticated_invalid_data(self):
        self.client.force_login(self.existing_user)
        payload = {
            "email": "invalid-email-format",  # invalid email
        }
        response = self.client.put(self.me_url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("email", response.data)

class PointViewTests(BaseAuthAPITestCase):
    def setUp(self):
        super().setUp()
        self.points_url = reverse("points")

        self.existing_user.points = 50
        self.existing_user.save()

    # -------------------- GET /me/points/ --------------------
    def test_get_points_unauthenticated(self):
        response = self.client.get(self.points_url, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_get_points_authenticated(self):
        self.client.force_login(self.existing_user)
        response = self.client.get(self.points_url, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.data
        self.assertIn("points", data)
        self.assertEqual(data["points"], self.existing_user.points)