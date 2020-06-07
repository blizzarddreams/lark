from posts.models import Post
from profiles.models import Profile
from .models import Favorite
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from .serializers import FavoriteSerializer
from comments.models import Comment
from rest_framework.decorators import (
    api_view,
    permission_classes,
    authentication_classes
)

# from .serializers import Serializer
# Create your views here.


def get_post_object(id_):
    try:
        return Post.objects.get(pk=id_)
    except Post.DoesNotExist:
        return False


def get_post_object_by_username_and_title_slug(username, title_slug):
    try:
        return Post.objects.get(
            profile__user__username=username,
            title_slug=title_slug
        )
    except Post.DoesNotExist:
        return False


def get_profile_object(id_):
    try:
        print(id_)
        return Profile.objects.get(user__pk=id_)
    except Profile.DoesNotExist:
        return False


def get_comment_object(id_):
    try:
        return Comment.objects.get(pk=id_)
    except Comment.DoesNotExist:
        return False


@api_view(['GET'])
def get_favorites_for_post(request, id_):
    post_ = get_post_object(id_)
    response = {'success': True, 'type': 'post'}
    favorites = post_.favorite_set.all()
    context = {'request': request}
    serializer = FavoriteSerializer(favorites, many=True, context=context)
    # serializer.is_valid()
    response['favorites'] = serializer.data
    return Response(response)


@api_view(['GET'])
def get_favorites_for_comment(request, id_):
    comment = get_comment_object(id_)
    response = {'success': True, 'type': 'post'}
    favorites = comment.favorite_set.all()
    context = {'request': request}
    serializer = FavoriteSerializer(favorites, many=True, context=context)
    # serializer.is_valid()
    response['favorites'] = serializer.data
    return Response(response)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def new_favorite_for_post(request):
    post_ = get_post_object(request.data['id'])
    profile = get_profile_object(request.user.id)
    response = {'success': True, 'type': 'post'}
    try:
        favorite = Favorite.objects.get(post=post_, profile=profile)
        favorite.delete()
        response['favorited'] = False
    except Favorite.DoesNotExist:
        favorite = Favorite()
        favorite.post = post_
        favorite.profile = profile
        favorite.save()
        response['favorited'] = True

    return Response(response)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def new_favorite_for_comment(request):
    comment = get_comment_object(request.data['id'])
    profile = get_profile_object(request.user.id)
    response = {'success': True, 'type': 'comment'}
    try:
        favorite = Favorite.objects.get(comment=comment, profile=profile)
        favorite.delete()
        response['favorited'] = False
    except Favorite.DoesNotExist:
        favorite = Favorite()
        favorite.comment = comment
        favorite.profile = profile
        favorite.save()
        response['favorited'] = True

    return Response(response)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def favorites_list(request, username, title_slug):
    post = get_post_object_by_username_and_title_slug(username, title_slug)
    favorites = Favorite.objects.filter(
        profile__user__id=request.user.id,
        post__id=post.id
    )
    context = {'request': request}
    serializer = FavoriteSerializer(favorites, many=True, context=context)
    # print(serializer.data)
    # if serializer.is_valid():
    #   print(serializer.data)
    #  return JsonResponse({'success': True, 'data': serializer.data})
    # else:
    #   print(serializer.errors)
    #  return JsonResponse(serializer.errors)


