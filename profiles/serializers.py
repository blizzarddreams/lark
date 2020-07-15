from django.contrib.auth.models import User
from posts.models import Post
from .models import Profile
from follows.models import Follow
from comments.models import Comment
from rest_framework import serializers
# from posts.serializers import PostSerializer
# from comments.serializers import CommentSerializer


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'id']

class ProfilePostSerializer(serializers.HyperlinkedModelSerializer):
    user = UserSerializer()
    class Meta:
        model = Profile
        fields = ['user']

class PostSerializer(serializers.HyperlinkedModelSerializer):

    profile = ProfilePostSerializer(read_only=True)

    class Meta:
        model = Post
        fields = [
            'title',
            'title_slug',
            'created_at',
            'id',
            'data',
            'subtitle',
            'profile',
        ]


class CommentSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Comment
        fields = ['data']




class ProfileSerializer(serializers.HyperlinkedModelSerializer):
    user = UserSerializer(read_only=True)
    posts = serializers.SerializerMethodField()
    follower_posts = serializers.SerializerMethodField()
    # posts = PostSerializer(read_only=True)
    # comments = CommentSerializer(read_only=True)

    def get_follower_posts(self, obj):
        followers_ = Follow.objects.filter(following__user__pk=obj.user.id)
        profile_ids = [x.follower.id for x in followers_]
        posts = Post.objects.filter(profile__pk__in=profile_ids).order_by('created_at').all()
        return PostSerializer(posts, many=True).data

    def get_posts(self, obj):
        posts_ = obj.post_set.all()[:5]
        return PostSerializer(posts_, many=True).data

    class Meta:
        model = Profile
        fields = ['user', 'id', 'posts', 'follower_posts']
        # , 'comments']
