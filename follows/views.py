from posts.models import Post
from profiles.models import Profile
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.decorators import (
    api_view,
    permission_classes,
    authentication_classes
)
from follows.models import Follow
# Create your views here.

def get_profile_object(id_):
    try:
        print(id_)
        return Profile.objects.get(user__pk=id_)
    except Profile.DoesNotExist:
        return False



@api_view(['POST'])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def follow_user(request):
    profile = get_profile_object(request.data['id'])
    auth = get_profile_object(request.user.id)

    if profile.user.id == auth.user.id:
        return Response({'success': False, 'error': 'You cannot follow yourself.'}, status=405)
    response = {'success': True}
    try:
        follow = Follow.objects.get(follower=auth, following=profile)
        follow.delete()
        response['following'] = False
    except Follow.DoesNotExist:
        follow = Follow()
        follow.follower = auth
        follow.following = profile
        follow.save()
        response['following'] = True

    return Response(response)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def is_following_user(request, id_):
    auth = get_profile_object(request.user.id)
    profile = get_profile_object(id_)

    response = {'success': True}

    try:
        Follow.objects.get(follower=auth, following=profile)
        response['following'] = True
    except Follow.DoesNotExist:
        response['following'] = False

    return Response(response)





