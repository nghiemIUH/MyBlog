from rest_framework.views import APIView
from rest_framework import status
from rest_framework import status
from django.contrib.auth import get_user_model, authenticate
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from .serializers import UserSerializer
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    user = request.data
    auth = authenticate(
        username=user['username'], password=user['password'])
    if auth is None:
        return Response(status=status.HTTP_400_BAD_REQUEST)
    se = UserSerializer(
        User.objects.get(username=user['username']))
    token = TokenObtainPairSerializer().get_token(user=auth)
    data = {
        'refresh_token': str(token),
        'access_token': str(token.access_token),
        'user': se.data
    }
    return Response(data=data, status=status.HTTP_200_OK)


@api_view(['GET', ])
# @permission_classes([IsAuthenticated])
def chech_login(request):
    print(request.user)
    serializer = UserSerializer(request.user)
    if serializer is not None:
        return Response(data = serializer.data,status=status.HTTP_200_OK)
    return Response(status=status.HTTP_400_BAD_REQUEST)
