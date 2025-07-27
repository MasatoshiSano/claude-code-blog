from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes, throttle_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import logout
from django.contrib.auth.signals import user_logged_in
from blog.throttling import LoginRateThrottle, RegisterRateThrottle
from .models import User
from .serializers import (
    CustomTokenObtainPairSerializer,
    UserSerializer,
    UserWithAuthorSerializer
)


class CustomTokenObtainPairView(TokenObtainPairView):
    """カスタムJWTトークン取得ビュー"""
    serializer_class = CustomTokenObtainPairSerializer
    throttle_classes = [LoginRateThrottle]
    
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # ログイン成功シグナルを送信
        user_logged_in.send(
            sender=User, 
            request=request, 
            user=serializer.validated_data['user']
        )
        
        return Response(serializer.validated_data, status=status.HTTP_200_OK)


class CustomTokenRefreshView(TokenRefreshView):
    """カスタムJWTトークンリフレッシュビュー"""
    
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        
        # ユーザー情報も含めてレスポンス
        if response.status_code == 200:
            refresh_token = request.data.get('refresh')
            if refresh_token:
                try:
                    refresh = RefreshToken(refresh_token)
                    user = User.objects.get(id=refresh['user_id'])
                    response.data['user'] = UserSerializer(user).data
                except Exception:
                    pass
        
        return response


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    """JWT ログアウトビュー"""
    try:
        refresh_token = request.data.get('refresh_token')
        if refresh_token:
            token = RefreshToken(refresh_token)
            token.blacklist()
        
        logout(request)
        return Response({'detail': 'ログアウトしました。'}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': 'ログアウトに失敗しました。'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_profile_view(request):
    """現在のユーザープロファイル取得"""
    serializer = UserWithAuthorSerializer(request.user)
    return Response(serializer.data)


@api_view(['PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
def update_profile_view(request):
    """ユーザープロファイル更新"""
    serializer = UserSerializer(request.user, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([AllowAny])
def auth_status_view(request):
    """認証状態確認"""
    if request.user.is_authenticated:
        return Response({
            'authenticated': True,
            'user': UserSerializer(request.user).data
        })
    return Response({'authenticated': False})


class UserDetailView(generics.RetrieveAPIView):
    """ユーザー詳細取得"""
    queryset = User.objects.all()
    serializer_class = UserWithAuthorSerializer
    permission_classes = [AllowAny]
    lookup_field = 'username'


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password_view(request):
    """パスワード変更"""
    user = request.user
    old_password = request.data.get('old_password')
    new_password = request.data.get('new_password')
    
    if not old_password or not new_password:
        return Response(
            {'error': '現在のパスワードと新しいパスワードの両方が必要です。'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    if not user.check_password(old_password):
        return Response(
            {'error': '現在のパスワードが正しくありません。'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    user.set_password(new_password)
    user.save()
    
    return Response({'detail': 'パスワードが正常に変更されました。'})