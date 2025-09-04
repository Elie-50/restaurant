import uuid
from django.db import models
from django.contrib.auth.models import AbstractUser
from helpers.models import BaseModeUUID
from diet.models import DietaryPreference

# Create your models here.
class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    phone_number = models.CharField(max_length=20, null=False, default='', blank=True) 
    is_verified = models.BooleanField(default=False)
    points = models.IntegerField(default=0, null=False)

    diet_preferences = models.ManyToManyField(DietaryPreference, blank=True, related_name="users")

class Address(BaseModeUUID):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="addresses")
    street = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    building = models.CharField(max_length=100)
    floor = models.CharField(max_length=100)
    gps_link = models.CharField(max_length=255, null=False, blank=True, default='')
    image = models.ImageField(upload_to="address_images/", blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at'] 

    def __str__(self):
        return f"{self.city}, Street {self.street} - {self.building}"