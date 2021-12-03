from rest_framework import serializers
from .models import Blog
from django.contrib.auth import get_user_model

User = get_user_model()


class Serial_User(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ['username', 'avatar']


class BlogSerializer(serializers.ModelSerializer):
    user = Serial_User()

    class Meta:
        model = Blog
        fields = '__all__'
