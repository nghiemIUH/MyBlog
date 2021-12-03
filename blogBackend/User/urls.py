from django.urls import path
from . import views
urlpatterns = [
    path('login/', views.LoginView.as_view(), name='login'),
    path('signup/', views.SignUpView.as_view(), name='signup'),
    path('logout/', views.logoutFn, name='logout')
]
