from django.urls import path
from . import views

urlpatterns = [
    path('dashboard/', views.get_profile, name='get_profile'),
    path('register/', views.register_user, name='register_user'),
    path('@<str:username>/', views.get_user, name='get_user')
]