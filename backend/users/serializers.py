from rest_framework import serializers
from .models import Address, User
from diet.serializers import DietaryPreferenceSerializer

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
        fields = ["id", "street", "city", "building", "floor", "gps_link", "image", "created_at"]
        read_only_fields = ["id", "created_at"]

    def update(self, instance, validated_data):
        # Only update the image if a new one is provided
        image = validated_data.pop("image", None)
        if image is not None:
            instance.image = image

        # Update all other fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance