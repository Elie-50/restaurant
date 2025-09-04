from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .serializers import UserSerializer, AddressSerializer
from rest_framework.viewsets import ModelViewSet
from .models import Address
from rest_framework.exceptions import NotFound
from .models import User
from diet.serializers import DietaryPreferenceSerializer
from diet.models import DietaryPreference

class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

    def put(self, request, *args, **kwargs):
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AddressViewSet(ModelViewSet):
    serializer_class = AddressSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Only return addresses of the logged-in user
        return Address.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # Set the user automatically when creating an address
        serializer.save(user=self.request.user)


class PointView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        return Response({ "points": request.user.points })
    

class PreferencesView(APIView):
    permission_classes = [IsAuthenticated]

    def get_target_user(self, request):
        user_id = request.query_params.get("id")
        if user_id:
            try:
                return User.objects.get(id=user_id)
            except User.DoesNotExist:
                raise NotFound()
        return request.user

    def get(self, request, *args, **kwargs):
        user = self.get_target_user(request)
        prefs = user.diet_preferences.all()
        serializer = DietaryPreferenceSerializer(prefs, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        """Attach an existing dietary preference to the authenticated user."""
        pref_id = request.data.get("id")
        if not pref_id:
            return Response(
                {"detail": "id is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            pref = DietaryPreference.objects.get(id=pref_id)
        except DietaryPreference.DoesNotExist:
            raise NotFound()
        request.user.diet_preferences.add(pref)
        serializer = DietaryPreferenceSerializer(pref)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def delete(self, request, *args, **kwargs):
        """Remove a dietary preference from the authenticated user."""
        pref_id = request.data.get("id")
        if not pref_id:
            return Response(
                {"detail": "id is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            pref = DietaryPreference.objects.get(id=pref_id)
        except DietaryPreference.DoesNotExist:
            raise NotFound()
        request.user.diet_preferences.remove(pref)
        return Response(status=status.HTTP_204_NO_CONTENT)
