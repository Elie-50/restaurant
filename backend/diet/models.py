from django.db import models
from helpers.models import BaseModeUUID

class DietaryPreference(BaseModeUUID):
    label = models.CharField(max_length=50, unique=True, blank=False, null=False)