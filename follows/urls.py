from django.urls import path
from . import views

urlpatterns = [
    path(
        'follow-user/',
        views.follow_user,
        name='new_follow'
    ),
]
