from django.db import models
from profiles.models import Profile

# Create your models here.


class Follow(models.Model):
    created_at = models.DateTimeField('created at', auto_now_add=True)
    updated_at = models.DateTimeField('updated_at', auto_now=True)
    follower = models.ForeignKey(
        Profile,
        on_delete=models.CASCADE,
        related_name='follower',
    )
    following = models.ForeignKey(
        Profile,
        on_delete=models.CASCADE,
        related_name='following',
    )

