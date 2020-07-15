from django.db import models
from django.contrib.auth.models import User
#from follows.models import Follow
# Create your models here.



class Profile(models.Model):
    # created_at = models.DateTimeField('created at')
    # username = models.CharField(max_length=255, unique=True)
    description = models.TextField(max_length=2000, null=True)
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    #following = models.ManyToManyField(Follow, related_name='following')
    #followers = models.ManyToManyField(Follow, related_name='followers')



