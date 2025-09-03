from rest_framework.serializers import ModelSerializer
from .models import DietaryPreference

class DietaryPreferenceSerializer(ModelSerializer):
    class Meta:
        model = DietaryPreference
        fields = '__all__'
        read_only_fields = ["id"]