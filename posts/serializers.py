from .models import Post
from rest_framework import serializers
from django.contrib.auth.models import User
from profiles.models import Profile
from comments.models import Comment
from favorites.models import Favorite
from bookmarks.models import Bookmark


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email']


class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Profile
        fields = ['user']


class CommentSerializer(serializers.ModelSerializer):
    favorite_count = serializers.SerializerMethodField()
    profile = ProfileSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = ['data', 'profile', 'id', 'created_at', 'favorite_count']

    def get_favorite_count(self, obj):
        return obj.favorite_set.count()


class PostFavoriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ['id']


class FavoriteSerializer(serializers.ModelSerializer):
    post_id = serializers.PrimaryKeyRelatedField(read_only=True)
    comment_id = serializers.PrimaryKeyRelatedField(read_only=True)
    profile = ProfileSerializer(read_only=True)

    class Meta:
        model = Favorite
        fields = ['post_id', 'comment_id', 'profile']


class PostSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(read_only=True)
    comments = CommentSerializer(
        many=True,
        read_only=True,
        source='comment_set'
    )
    favorite_count = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = [
            'title',
            'data',
            'profile',
            'comments',
            'created_at',
            'id',
            'subtitle',
            'favorite_count',
            # 'title_slug'
        ]

    def get_favorite_count(self, obj):
        return obj.favorite_set.count()


class BookmarkSerializer(serializers.ModelSerializer):
    post_id = serializers.PrimaryKeyRelatedField(read_only=True)
    comment_id = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Bookmark
        fields = ['post_id', 'comment_id']