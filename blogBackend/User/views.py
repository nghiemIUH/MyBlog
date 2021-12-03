from django.shortcuts import redirect, render
from rest_framework.views import APIView
from rest_framework import status
from django.contrib.auth import get_user_model, authenticate, login, logout
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.decorators import api_view
from .serializers import UserSerializer
from django.views import View
import json
from django.http.response import JsonResponse


User = get_user_model()


class LoginView(View):

    def get(self, request):
        return render(request, 'user/login.html')

    def post(self, request):
        user = json.loads(request.body.decode("utf-8"))
        auth = authenticate(
            username=user['username'], password=user['password'])
        if auth is None:
            return JsonResponse({'status': 'sai'}, status=400)
        login(request, auth)
        return JsonResponse({'status': 'đúng'}, status=200)


def logoutFn(request):
    logout(request)
    return redirect('/')


class SignUpView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        return render(request, 'user/signup.html')

    def post(self, request):
        data = request.data
        try:
            User.objects.get(email=data['email'])
            return Response(data={'error': 'Email đã tồn tại'}, status=status.HTTP_400_BAD_REQUEST)
        except:
            pass
        try:
            user = User.objects.create_user(
                username=data['username'],
                email=data['email'],
                password=data['password'],
                avatar=data['avatar'],
                full_name=data['full_name']
            )
            user.save()
            return Response(status=status.HTTP_201_CREATED)
        except:
            return Response(data={'error': 'Tài khoản đã tồn tại'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', ])
def getInfo(request):
    user = request.user
    serialize = UserSerializer(instance=user)
    return Response(data=serialize.data, status=status.HTTP_200_OK)


@api_view(['POST'])
def update(request):
    serialize = UserSerializer(
        instance=request.user, data=request.data, partial=True)

    if serialize.is_valid():
        serialize.save()
        return Response(data=serialize.data, status=status.HTTP_200_OK)
    return Response(status=status.HTTP_400_BAD_REQUEST)
