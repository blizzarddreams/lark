from django.contrib.auth.models import User
from posts.models import Post
from .models import Profile
from comments.models import Comment
from rest_framework import serializers
# from posts.serializers import PostSerializer
# from comments.serializers import CommentSerializer


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'id']


class PostSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Post
        fields = [
            'title',
            'title_slug',
            'created_at',
            'id',
            'data',
            'subtitle'
        ]


class CommentSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Comment
        fields = ['data']


class ProfileSerializer(serializers.HyperlinkedModelSerializer):
    user = UserSerializer(read_only=True)
    posts = serializers.SerializerMethodField()#PostSerializer(read_only=True, many=True, source='post_set')
    # posts = PostSerializer(read_only=True)
    # comments = CommentSerializer(read_only=True)

    def get_posts(self, obj):
        posts_ = obj.post_set.all()[:5]
        return PostSerializer(posts_, many=True).data

    class Meta:
        model = Profile
        fields = ['user', 'id', 'posts']
        # , 'comments']
