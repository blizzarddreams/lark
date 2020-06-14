from profiles.models import Profile
from django.contrib.auth.models import User
from .forms import RegisterForm
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.decorators import (
    api_view,
    permission_classes,
    authentication_classes
)
from .serializers import ProfileSerializer
# Create your views here.


@api_view(['GET'])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def get_dashboard(request):
    print(request.user.id)
    profile = Profile.objects.get(user__pk=request.user.id)
    serializer = ProfileSerializer(profile)
    response = {'success': True, 'data': serializer.data}
    return Response(response)


@api_view(['GET'])
def get_user(request, username):
    profile = Profile.objects.filter(user__username__iexact=username)[0]
    serializer = ProfileSerializer(profile)
    response = {'success': True, 'user': serializer.data}
    return Response(response)


@api_view(['POST'])
def register_user(request):
    if request.method == 'POST':
        print(request.data)
        user = RegisterForm(request.data)
        if user.is_valid():
            user.save()
            username = user.cleaned_data['username']
            user_ = User.objects.filter(username__iexact=username)[0]
            profile = Profile()
            profile.user = user_
            profile.save()
            return Response({'success': True})
        else:
            return Response({'success': False, 'errors': user.errors})
