from django.urls import path
from . import views

urlpatterns = [
    path(
        'favorite-post/',
        views.new_favorite_for_post,
        name='new_favorite_for_post'
    ),
    path(
        'favorite-comment/',
        views.new_favorite_for_comment,
        name='new_favorite_for_comment'
    ),
    path(
        '<str:username>/<slug:title_slug>/',
        views.favorites_list,
        name='favorites_list'
    ),
    path(
        'post/<int:id_>',
        views.get_favorites_for_post,
        name='favorites_for_post'
    ),
    path(
        'comment/<int:id_>',
        views.get_favorites_for_comment,
        name='favorites_for_comment'
    )
]
