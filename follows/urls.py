from django.urls import path
from . import views

urlpatterns = [
    path(
        'follow-user/',
        views.follow_user,
        name='new_follow'
    ),
    path('following/<int:id_>/', views.is_following_user, name='is_following'),
]
