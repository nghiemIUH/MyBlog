from django.urls import path
from . import views


# app_name = 'blog'

urlpatterns = [
    path('', views.BlogView.as_view(), name='blog'),
    path('detail/<slug:slug>', views.detail, name='blog_detail'),
    path('write/', views.WriteBlog.as_view(), name='write'),
    path('my-post/', views.MyPost.as_view(), name='my-post'),
    path('edit/<slug:slug>', views.edit, name='edit')
]
