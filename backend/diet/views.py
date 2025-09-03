from rest_framework.viewsets import ModelViewSet
from helpers.permissions import ReadOnlyOrSuperUser
from .serializers import DietaryPreferenceSerializer
from .models import DietaryPreference

class DietaryPreferenceViewSet(ModelViewSet):
    permission_classes = [ReadOnlyOrSuperUser]
    serializer_class = DietaryPreferenceSerializer
    queryset = DietaryPreference.objects.all()
