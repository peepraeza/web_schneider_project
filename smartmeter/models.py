from django.conf import settings
from django.db import models
from django.utils import timezone
import hashlib 

"""
Category of plants that are created by users
"""
class Meter(models.Model):
    channel = models.IntegerField()
    description = models.CharField(max_length=200)
    create_record_timestamp = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.channel
