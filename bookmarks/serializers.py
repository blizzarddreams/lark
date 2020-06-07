from rest_framework import serializers
from .models import Bookmark
from profiles.models import Profile
from django.contrib.auth.models import User
from posts.models import Post
from comments.models import Comment


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email']


class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Profile
        fields = ['user']


class PostSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(read_only=True)

    class Meta:
        model = Post
        fields = ['id', 'title', 'title_slug', 'data', 'profile', 'subtitle', 'created_at']


class CommentSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(read_only=True)
    post = PostSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'data', 'profile', 'created_at', 'post']


class BookmarkSerializer(serializers.ModelSerializer):
    post = PostSerializer(read_only=True)
    comment = CommentSerializer(read_only=True)

    class Meta:
        model = Bookmark
        fields = ['id', 'post', 'comment', 'created_at']
