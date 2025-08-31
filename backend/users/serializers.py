from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Address

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "is_active",
            "is_staff",
            "is_superuser",
            "phone_number",
            "is_verified",
        ]
        read_only_fields = ["id", "is_active", "is_staff", "is_superuser", "is_verified"]


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = ["id", "user", "street", "city", "building", "floor", "created_at"]
        read_only_fields = ["id", "created_at"]