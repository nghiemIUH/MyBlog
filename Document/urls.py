from os import name
from django.urls import path
from . import views
urlpatterns = [
    path('', views.getDocument, name='doc'),
    path('<slug:slug>/', views.getDocDetail, name='doc_detail')
]
