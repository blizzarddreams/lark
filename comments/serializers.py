from .models import Comment
from rest_framework import serializers
# from profiles.serializers import ProfileSerializer
# from posts.serializers import PostSerializer
from django.contrib.auth.models import User
from profiles.models import Profile


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email']


class ProfileSerializer(serializers.HyperlinkedModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Profile
        fields = ['user']


class CommentSerializer(serializers.HyperlinkedModelSerializer):
    profile = ProfileSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = ['data', 'profile', 'id', 'created_at']