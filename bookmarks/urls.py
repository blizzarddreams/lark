from django.urls import path
from . import views
from rest_framework.urlpatterns import format_suffix_patterns
from rest_framework import routers

urlpatterns = [
    path('bookmark-post/', views.new_bookmark_for_post, name='new_bookmark_for_post'),
    path('bookmark-comment/', views.new_bookmark_for_comment, name='new_bookmark_for_comment'),
    path('all/', views.get_bookmarks, name='get_bookmarks')
    #path('<str:username>/<slug:title_slug>/', views.bookmarks_list, name='bookmarks_list'),
]