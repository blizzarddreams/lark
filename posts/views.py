from django.db.models import Q
from .models import Post
from profiles.models import Profile
from django.utils.text import slugify
from bookmarks.models import Bookmark
from favorites.models import Favorite
from rest_framework.decorators import (
    api_view,
    permission_classes,
    authentication_classes
)
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.authentication import JWTAuthentication
# from rest_framework.authentication import
from .serializers import PostSerializer, FavoriteSerializer, BookmarkSerializer
# Create your views here.


def get_object(username, title_slug):
    try:
        return Post.objects.get(
            profile__user__username=username,
            title_slug=title_slug
        )
    except Post.DoesNotExist:
        return False


def get_object_by_id(id_):
    try:
        return Post.objects.get(pk=id_)
    except Post.DoesNotExist:
        return False


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def delete_post(request, id_):
    post = get_object_by_id(id_)
    if post.profile.user.id != request.user.id:
        return False
    post.delete()
    return Response({'success': True})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def edit_post(request, username, title_slug):
    if request.method == 'GET':
        post = get_object(username, title_slug)
        if post.profile.user.id != request.user.id:
            return False

        serializer = PostSerializer(post)
        response = {'success': True, 'post': serializer.data}
        return Response(response)


@api_view(['GET'])
@permission_classes([])
@authentication_classes([])
def get_post(request, username, title_slug):
    post = get_object(username, title_slug)
    serializer = PostSerializer(post)
    response = {'success': True, 'data': serializer.data}
    if request.auth:
        profile = Profile.objects.get(user__pk=request.user.id)
        comment_ids = post.comment_set.all().values_list('id', flat=True)
        favorites_query = Favorite.objects.filter(
            Q(profile__pk=profile.id),
            Q(post__pk=post.id) | Q(comment__pk__in=comment_ids)
        )
        favorites = FavoriteSerializer(data=favorites_query, many=True)
        favorites.is_valid()
        print(favorites.data)
        response['favorites'] = favorites.data

        bookmarks_query = Bookmark.objects.filter(
            Q(profile__pk=profile.id),
            Q(post__pk=post.id) | Q(comment__pk__in=comment_ids)
        )
        bookmarks = BookmarkSerializer(data=bookmarks_query, many=True)
        bookmarks.is_valid()
        response['bookmarks'] = bookmarks.data
        if request.user.id == post.profile.user.id:
            response['is_owner'] = True

    return Response(response)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def post_list(request):
    posts = Post.objects.all()
    serializer = PostSerializer(posts, many=True)
    response = {'success': True, 'data': serializer.data}
    return Response(response)


@api_view(['GET'])
def find_posts(request, qs):
    posts = Post.objects.filter(title__icontains=qs)
    serializer = PostSerializer(posts, many=True)
    # serializer.is_valid()
    response = {'success': True, 'posts': serializer.data}
    return Response(response)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def new_post(request):
    serializer = PostSerializer(data=request.data)
    if serializer.is_valid():
        profile = Profile.objects.get(user__pk=request.user.id)
        serializer.validated_data['profile'] = profile
        title = serializer.validated_data['title']
        serializer.validated_data['title_slug'] = slugify(title)
        serializer.save()
        response = {'success': True, 'data': serializer.data}
        return Response(response)
    else:
        response = {'success': False, 'errors': serializer.errors}
        return Response(response)
