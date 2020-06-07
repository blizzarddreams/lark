from django.db import models
from profiles.models import Profile


# Create your models here.
class Post(models.Model):
    created_at = models.DateTimeField('created at', auto_now_add=True)
    updated_at = models.DateTimeField('updated_at', auto_now=True)
    title = models.CharField(max_length=100)
    subtitle = models.CharField(max_length=200)
    title_slug = models.SlugField(max_length=200)
    data = models.TextField(max_length=100000)
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE)
