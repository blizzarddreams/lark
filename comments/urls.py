from django.urls import path
from . import views

urlpatterns = [
    path('new/', views.new_comment, name='new_comment'),# fix
    path('delete/<int:id_>/', views.delete_comment, name='delete_comment'),
]