from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    """カスタムユーザーモデル"""
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
    bio = models.TextField(max_length=500, blank=True)
    articles_count = models.PositiveIntegerField(default=0)
    
    def __str__(self):
        return self.username