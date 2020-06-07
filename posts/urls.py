from django.urls import path
from . import views

urlpatterns = [
    path('new/', views.new_post, name='new_post'),
    path('search/<str:qs>/', views.find_posts, name='find_posts'),
    path('delete/<int:id_>/', views.delete_post, name='delete_post'),
    path(
        '<str:username>/<slug:title_slug>/edit/',
        views.edit_post,
        name='edit_post'
    ),
    path('<str:username>/<slug:title_slug>/', views.get_post, name='get_post'),
]
