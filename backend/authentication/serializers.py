from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from dj_rest_auth.registration.serializers import RegisterSerializer
from dj_rest_auth.serializers import LoginSerializer
from django.contrib.auth import authenticate
from .models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 
                 'avatar', 'bio', 'articles_count', 'date_joined']
        read_only_fields = ['id', 'date_joined', 'articles_count']


class CustomRegisterSerializer(RegisterSerializer):
    first_name = serializers.CharField(required=False, max_length=30)
    last_name = serializers.CharField(required=False, max_length=30)
    
    def get_cleaned_data(self):
        return {
            'username': self.validated_data.get('username', ''),
            'password1': self.validated_data.get('password1', ''),
            'email': self.validated_data.get('email', ''),
            'first_name': self.validated_data.get('first_name', ''),
            'last_name': self.validated_data.get('last_name', ''),
        }


class CustomLoginSerializer(LoginSerializer):
    username = None
    email = serializers.EmailField(required=True)
    password = serializers.CharField(style={'input_type': 'password'})


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """カスタムJWTトークン取得シリアライザー"""
    username_field = 'email'
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['email'] = serializers.EmailField()
        self.fields['password'] = serializers.CharField()
        # usernameフィールドを削除
        del self.fields['username']
    
    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')
        
        if email and password:
            user = authenticate(
                request=self.context.get('request'),
                email=email,
                password=password
            )
            
            if not user:
                raise serializers.ValidationError('無効なメールアドレスまたはパスワードです。')
            
            if not user.is_active:
                raise serializers.ValidationError('このアカウントは無効になっています。')
            
            # JWTトークンを生成
            refresh = self.get_token(user)
            
            return {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': UserSerializer(user).data
            }
        else:
            raise serializers.ValidationError('メールアドレスとパスワードの両方が必要です。')


class AuthorProfileSerializer(serializers.ModelSerializer):
    """著者プロファイル用シリアライザー"""
    
    class Meta:
        from blog.models import Author
        model = Author
        fields = ['id', 'display_name', 'slug', 'name', 'email', 'avatar', 'bio', 'articles_count']
        read_only_fields = ['id', 'slug', 'name', 'email', 'avatar', 'bio', 'articles_count']


class UserWithAuthorSerializer(serializers.ModelSerializer):
    """ユーザー情報と著者プロファイルを含むシリアライザー"""
    author_profile = AuthorProfileSerializer(read_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 
                 'avatar', 'bio', 'articles_count', 'date_joined', 'author_profile']
        read_only_fields = ['id', 'date_joined', 'articles_count']