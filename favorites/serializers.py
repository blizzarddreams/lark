from rest_framework import serializers
from .models import Favorite
from profiles.models import Profile
from django.contrib.auth.models import User
from posts.models import Post


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email']


class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ['id']


class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Profile
        fields = ['user']


class FavoriteSerializer(serializers.ModelSerializer):
    post = PostSerializer(read_only=True)
    profile = ProfileSerializer(read_only=True)

    class Meta:
        model = Favorite
        fields = ['id', 'post', 'profile']
