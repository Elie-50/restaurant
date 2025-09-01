from django.urls import reverse
from rest_framework import status
from auth.tests import BaseAuthAPITestCase
from users.models import User
from users.models import Address
from helpers.utils import create_dummy_image


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


class AddressViewSetTests(BaseAuthAPITestCase):
    def setUp(self):
        super().setUp()
        self.address_url = reverse("address-list")
        # Create a second user
        self.other_user = User.objects.create_user(
            username="otheruser",
            email="other@example.com",
            password="otherpassword123"
        )
        # Create addresses for both users
        self.address1 = Address.objects.create(
            user=self.existing_user,
            street="Main Street",
            city="CityA",
            building="B1",
            floor="1",
            gps_link="http://maps.example.com/1"
        )
        self.address2 = Address.objects.create(
            user=self.other_user,
            street="Other Street",
            city="CityB",
            building="B2",
            floor="2",
            gps_link="http://maps.example.com/2"
        )

    # -------------------- Unauthenticated --------------------
    def test_list_unauthenticated(self):
        response = self.client.get(self.address_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_create_unauthenticated(self):
        payload = {"street": "New Street", "city": "CityC", "building": "B3", "floor": "3"}
        response = self.client.post(self.address_url, payload)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    # -------------------- List --------------------
    def test_list_authenticated(self):
        self.client.force_login(self.existing_user)
        response = self.client.get(self.address_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Only addresses belonging to the logged-in user
        self.assertEqual(len(response.data["results"]), 1)
        self.assertEqual(response.data['results'][0]["id"], str(self.address1.id))

    # -------------------- Retrieve --------------------
    def test_retrieve_own_address(self):
        self.client.force_login(self.existing_user)
        url = reverse("address-detail", args=[self.address1.id])

        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["street"], self.address1.street)

    def test_retrieve_other_user_address(self):
        self.client.force_login(self.existing_user)
        url = reverse("address-detail", args=[self.address2.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    # -------------------- Create --------------------
    def test_create_address_valid(self):
        self.client.force_login(self.existing_user)
        payload = {
            "street": "New Street",
            "city": "CityC",
            "building": "B3",
            "floor": "3",
            "gps_link": "http://maps.example.com/new",
        }

        response = self.client.post(self.address_url, payload)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Confirm user is assigned automatically
        self.assertEqual(response.data["street"], payload["street"])
        self.assertEqual(Address.objects.get(id=response.data["id"]).user, self.existing_user)

    def test_create_address_missing_required_field(self):
        self.client.force_login(self.existing_user)
        payload = {
            "city": "CityC",
            "building": "B3",
        }
        response = self.client.post(self.address_url, payload)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("street", response.data)
        self.assertIn("floor", response.data)

    # -------------------- Update --------------------
    def test_update_own_address_partial(self):
        self.client.force_login(self.existing_user)
        url = reverse("address-detail", args=[self.address1.id])
        payload = {"street": "Updated Street"}

        response = self.client.patch(url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.address1.refresh_from_db()
        self.assertEqual(self.address1.street, payload["street"])

    def test_update_other_user_address(self):
        self.client.force_login(self.existing_user)
        url = reverse("address-detail", args=[self.address2.id])
        payload = {"street": "Hacked Street"}

        response = self.client.patch(url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.address2.refresh_from_db()
        self.assertNotEqual(self.address2.street, "Hacked Street")

    def test_update_image_field(self):
        self.client.force_login(self.existing_user)
        url = reverse("address-detail", args=[self.address1.id])

        payload = {
            "image": create_dummy_image(),
        }

        # Use PATCH for partial update
        response = self.client.patch(url, payload, format="multipart")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Refresh and assert image was updated
        self.address1.refresh_from_db()
        self.assertTrue(bool(self.address1.image))

    # -------------------- Delete --------------------
    def test_delete_own_address(self):
        self.client.force_login(self.existing_user)
        url = reverse("address-detail", args=[self.address1.id])

        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Address.objects.filter(id=self.address1.id).exists())

    def test_delete_other_user_address(self):
        self.client.force_login(self.existing_user)
        url = reverse("address-detail", args=[self.address2.id])
        
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertTrue(Address.objects.filter(id=self.address2.id).exists())
