from django.db import models
from profiles.models import Profile
from posts.models import Post
from comments.models import Comment

# Create your models here.


class Bookmark(models.Model):
    created_at = models.DateTimeField('created at', auto_now_add=True)
    updated_at = models.DateTimeField('updated_at', auto_now=True)
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE)

    post = models.ForeignKey(
        Post,
        on_delete=models.CASCADE,
        blank=True,
        null=True
    )
    comment = models.ForeignKey(
        Comment,
        on_delete=models.CASCADE,
        blank=True,
        null=True
    )

    class Meta:
        ordering = ['-created_at']