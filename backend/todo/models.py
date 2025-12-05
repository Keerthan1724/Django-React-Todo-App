from django.db import models
from django.contrib.auth.models import User
import random
from datetime import timedelta
from django.utils import timezone
from django.conf import settings
import os

class Todo(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE) 
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
    
class EmailOTP(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    otp = models.CharField(max_length=4)
    created_at = models.DateTimeField(auto_now_add=True)

    def generate_otp(self):
        return str(random.randint(1000, 9999))
    
    def is_expired(self):
        return timezone.now() > self.created_at + timedelta(seconds=59)


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    profile_image = models.ImageField(upload_to='profile_images/', blank=True, null=True)

    def __str__(self):
        return self.user.username

    def save(self, *args, **kwargs):
        try:
            old = Profile.objects.get(pk=self.pk)
            if old.profile_image and self.profile_image != old.profile_image:
                old_path = os.path.join(settings.MEDIA_ROOT, old.profile_image.name)
                if os.path.exists(old_path):
                    os.remove(old_path)
        except Profile.DoesNotExist:
            pass  # no old image, first save
        super().save(*args, **kwargs)