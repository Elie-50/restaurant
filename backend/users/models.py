import uuid
from django.db import models
from django.contrib.auth.models import AbstractUser
from helpers.models import BaseModeUUID

# Create your models here.
class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    phone_number = models.CharField(max_length=20, null=False, default='', blank=True) 
    is_verified = models.BooleanField(default=False)
    points = models.IntegerField(default=0, null=False)

class Address(BaseModeUUID):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="addresses")
    street = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    building = models.CharField(max_length=100)
    floor = models.CharField(max_length=100)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.city}, Street {self.street} - {self.building}"