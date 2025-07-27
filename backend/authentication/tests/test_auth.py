from django.test import TestCase
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
import json

User = get_user_model()


class JWTAuthenticationTest(TestCase):
    """JWT認証のテスト"""
    
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123',
            first_name='Test',
            last_name='User'
        )
    
    def test_obtain_jwt_token(self):
        """JWTトークン取得のテスト"""
        url = '/api/auth/jwt/token/'
        data = {
            'email': 'test@example.com',
            'password': 'testpass123'
        }
        
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
        self.assertIn('user', response.data)
        self.assertEqual(response.data['user']['email'], 'test@example.com')
    
    def test_obtain_jwt_token_invalid_credentials(self):
        """無効な認証情報でのJWTトークン取得テスト"""
        url = '/api/auth/jwt/token/'
        data = {
            'email': 'test@example.com',
            'password': 'wrongpassword'
        }
        
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_refresh_jwt_token(self):
        """JWTトークンリフレッシュのテスト"""
        # まずトークンを取得
        refresh = RefreshToken.for_user(self.user)
        
        url = '/api/auth/jwt/token/refresh/'
        data = {'refresh': str(refresh)}
        
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
    
    def test_verify_jwt_token(self):
        """JWTトークン検証のテスト"""
        refresh = RefreshToken.for_user(self.user)
        access_token = str(refresh.access_token)
        
        url = '/api/auth/jwt/token/verify/'
        data = {'token': access_token}
        
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_access_protected_endpoint_with_token(self):
        """トークンを使用した保護されたエンドポイントへのアクセステスト"""
        refresh = RefreshToken.for_user(self.user)
        access_token = str(refresh.access_token)
        
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')
        
        url = '/api/auth/profile/'
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['email'], 'test@example.com')
    
    def test_access_protected_endpoint_without_token(self):
        """トークンなしでの保護されたエンドポイントへのアクセステスト"""
        url = '/api/auth/profile/'
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_logout(self):
        """ログアウトのテスト"""
        refresh = RefreshToken.for_user(self.user)
        access_token = str(refresh.access_token)
        
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')
        
        url = '/api/auth/jwt/logout/'
        data = {'refresh_token': str(refresh)}
        
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class UserProfileTest(TestCase):
    """ユーザープロファイルのテスト"""
    
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123',
            first_name='Test',
            last_name='User',
            bio='Test bio'
        )
    
    def get_jwt_token(self):
        """JWTトークンを取得"""
        refresh = RefreshToken.for_user(self.user)
        return str(refresh.access_token)
    
    def test_get_user_profile(self):
        """ユーザープロファイル取得のテスト"""
        token = self.get_jwt_token()
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        
        url = '/api/auth/profile/'
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], 'testuser')
        self.assertEqual(response.data['email'], 'test@example.com')
        self.assertEqual(response.data['bio'], 'Test bio')
    
    def test_update_user_profile(self):
        """ユーザープロファイル更新のテスト"""
        token = self.get_jwt_token()
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        
        data = {
            'first_name': 'Updated',
            'last_name': 'User',
            'bio': 'Updated bio'
        }
        
        url = '/api/auth/profile/update/'
        response = self.client.patch(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        self.user.refresh_from_db()
        self.assertEqual(self.user.first_name, 'Updated')
        self.assertEqual(self.user.bio, 'Updated bio')
    
    def test_change_password(self):
        """パスワード変更のテスト"""
        token = self.get_jwt_token()
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        
        data = {
            'old_password': 'testpass123',
            'new_password': 'newpass123'
        }
        
        url = '/api/auth/change-password/'
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # 新しいパスワードでログインできることを確認
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password('newpass123'))
    
    def test_change_password_wrong_old_password(self):
        """間違った現在のパスワードでの変更テスト"""
        token = self.get_jwt_token()
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        
        data = {
            'old_password': 'wrongpassword',
            'new_password': 'newpass123'
        }
        
        url = '/api/auth/change-password/'
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class AuthStatusTest(TestCase):
    """認証状態のテスト"""
    
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
    
    def test_auth_status_authenticated(self):
        """認証済みユーザーの状態確認テスト"""
        refresh = RefreshToken.for_user(self.user)
        access_token = str(refresh.access_token)
        
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')
        
        url = '/api/auth/status/'
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['authenticated'])
        self.assertEqual(response.data['user']['email'], 'test@example.com')
    
    def test_auth_status_unauthenticated(self):
        """未認証ユーザーの状態確認テスト"""
        url = '/api/auth/status/'
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(response.data['authenticated'])


class UserRegistrationTest(TestCase):
    """ユーザー登録のテスト"""
    
    def setUp(self):
        self.client = APIClient()
    
    def test_user_registration_success(self):
        """ユーザー登録成功のテスト"""
        data = {
            'email': 'newuser@example.com',
            'password1': 'newpass123',
            'password2': 'newpass123',
            'first_name': 'New',
            'last_name': 'User'
        }
        
        url = '/api/auth/registration/'
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(email='newuser@example.com').exists())
    
    def test_user_registration_password_mismatch(self):
        """パスワード不一致での登録テスト"""
        data = {
            'email': 'newuser@example.com',
            'password1': 'newpass123',
            'password2': 'differentpass',
            'first_name': 'New',
            'last_name': 'User'
        }
        
        url = '/api/auth/registration/'
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_user_registration_duplicate_email(self):
        """重複メールアドレスでの登録テスト"""
        User.objects.create_user(
            username='existing',
            email='existing@example.com',
            password='existingpass'
        )
        
        data = {
            'email': 'existing@example.com',
            'password1': 'newpass123',
            'password2': 'newpass123'
        }
        
        url = '/api/auth/registration/'
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)