from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()
router.register(r'addresses', AddressViewSet, basename='address')

urlpatterns = [
    path('me/', include(router.urls)),
    path('me/', MeView.as_view(), name='me'),
    path('me/points/', PointView.as_view(), name='points'),
]
