from django.shortcuts import render
from .forms import CommentForm
from posts.models import Post
from profiles.models import Profile
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .serializers import CommentSerializer
from .models import Comment
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.decorators import (
    api_view,
    permission_classes,
    authentication_classes
)
# Create your views here.


def get_object_by_id(id_):
    try:
        return Comment.objects.get(pk=id_)
    except Post.DoesNotExist:
        return False


@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def new_comment(request):
    serializer = CommentSerializer(data=request.data)
    if serializer.is_valid():
        profile = Profile.objects.get(user__pk=request.user.id)
        serializer.validated_data['profile'] = profile
        post = Post.objects.get(
            profile__user__username=request.data['username'],
            title_slug=request.data['titleSlug'])
        serializer.validated_data['post'] = post
        serializer.save()

        response = {'success': True, 'data': serializer.data}
        return Response(response)
    else:
        response = {'success': False, 'errors': serializer.errors}
        return Response(response)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def delete_comment(request, id_):
    comment = get_object_by_id(id_)
    if comment.profile.user.id != request.user.id:
        return False
    comment.delete()
    return Response({'success': True})

def new(request):
    form = CommentForm(request.POST)
    if form.is_valid:
        comment = form.save(commit=False)

        post_id = request.POST['post']
        post = Post.objects.get(pk=post_id)

        profile = Profile.objects.get(user__pk=request.user.id)

        comment.post = post
        comment.profile = profile

        comment.save()
        return render(request, "posts/show.html", {'post': post})