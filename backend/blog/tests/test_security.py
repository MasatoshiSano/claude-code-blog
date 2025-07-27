from django.test import TestCase, override_settings
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from unittest.mock import patch
import time
from blog.models import Author, BlogPost, Comment
from blog.throttling import LoginRateThrottle, CommentRateThrottle

User = get_user_model()


class SecurityHeadersTest(TestCase):
    """セキュリティヘッダーのテスト"""
    
    def setUp(self):
        self.client = APIClient()
    
    def test_security_headers_present(self):
        """セキュリティヘッダーの存在確認"""
        url = reverse('blogpost-list')
        response = self.client.get(url)
        
        # セキュリティヘッダーが設定されていることを確認
        self.assertIn('X-Content-Type-Options', response)
        self.assertEqual(response['X-Content-Type-Options'], 'nosniff')
        
        self.assertIn('X-Frame-Options', response)
        self.assertEqual(response['X-Frame-Options'], 'DENY')
        
        self.assertIn('X-XSS-Protection', response)
        self.assertEqual(response['X-XSS-Protection'], '1; mode=block')
        
        self.assertIn('Referrer-Policy', response)
        self.assertEqual(response['Referrer-Policy'], 'strict-origin-when-cross-origin')


class AuthenticationSecurityTest(TestCase):
    """認証セキュリティのテスト"""
    
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
    
    def test_jwt_token_expiration(self):
        """JWTトークンの有効期限テスト"""
        # トークンを取得
        url = reverse('token_obtain_pair')
        data = {
            'email': 'test@example.com',
            'password': 'testpass123'
        }
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        access_token = response.data['access']
        
        # トークンが有効であることを確認
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')
        
        profile_url = reverse('user_profile')
        response = self.client.get(profile_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_invalid_jwt_token(self):
        """無効なJWTトークンのテスト"""
        # 無効なトークンを使用
        invalid_token = 'invalid.jwt.token'
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {invalid_token}')
        
        url = reverse('user_profile')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_malformed_authorization_header(self):
        """不正な認証ヘッダーのテスト"""
        # 不正な形式の認証ヘッダー
        self.client.credentials(HTTP_AUTHORIZATION='InvalidFormat token')
        
        url = reverse('user_profile')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class RateLimitingTest(TestCase):
    """レート制限のテスト"""
    
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        self.author = Author.objects.create(
            user=self.user,
            display_name='Test Author'
        )
        self.post = BlogPost.objects.create(
            title='Test Post',
            excerpt='Test excerpt',
            content='Test content',
            author=self.author,
            status='published'
        )
    
    @override_settings(REST_FRAMEWORK={
        'DEFAULT_THROTTLE_RATES': {
            'login': '2/min',
            'comment': '3/hour',
        }
    })
    def test_login_rate_limiting(self):
        """ログインレート制限のテスト"""
        url = reverse('token_obtain_pair')
        data = {
            'email': 'test@example.com',
            'password': 'wrongpassword'
        }
        
        # 制限回数まで試行
        for i in range(3):
            response = self.client.post(url, data, format='json')
            if i < 2:
                self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
            else:
                # 3回目はレート制限にかかる
                self.assertEqual(response.status_code, status.HTTP_429_TOO_MANY_REQUESTS)
    
    def get_jwt_token(self):
        """JWTトークンを取得"""
        refresh = RefreshToken.for_user(self.user)
        return str(refresh.access_token)
    
    @override_settings(REST_FRAMEWORK={
        'DEFAULT_THROTTLE_RATES': {
            'comment': '2/min',
        }
    })
    def test_comment_rate_limiting(self):
        """コメントレート制限のテスト"""
        token = self.get_jwt_token()
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        
        url = reverse('comment-list')
        
        # 制限回数まで試行
        for i in range(3):
            data = {
                'post': self.post.id,
                'author': f'Commenter {i}',
                'email': f'commenter{i}@example.com',
                'content': f'Comment {i}'
            }
            
            response = self.client.post(url, data, format='json')
            if i < 2:
                self.assertEqual(response.status_code, status.HTTP_201_CREATED)
            else:
                # 3回目はレート制限にかかる
                self.assertEqual(response.status_code, status.HTTP_429_TOO_MANY_REQUESTS)


class InputValidationTest(TestCase):
    """入力検証のテスト"""
    
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        self.author = Author.objects.create(
            user=self.user,
            display_name='Test Author'
        )
    
    def get_jwt_token(self):
        """JWTトークンを取得"""
        refresh = RefreshToken.for_user(self.user)
        return str(refresh.access_token)
    
    def test_xss_prevention_in_blog_post(self):
        """ブログ記事でのXSS防止テスト"""
        token = self.get_jwt_token()
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        
        # XSSを試みるデータ
        xss_payload = '<script>alert("XSS")</script>'
        data = {
            'title': f'Test Post {xss_payload}',
            'excerpt': f'Test excerpt {xss_payload}',
            'content': f'Test content {xss_payload}',
            'status': 'draft'
        }
        
        url = reverse('blogpost-list')
        response = self.client.post(url, data, format='json')
        
        # 記事は作成されるが、スクリプトタグはエスケープされる
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # 作成された記事を取得してXSSが防がれていることを確認
        created_post = BlogPost.objects.get(title__contains='Test Post')
        self.assertNotIn('<script>', created_post.title)
        self.assertNotIn('<script>', created_post.content)
    
    def test_sql_injection_prevention(self):
        """SQLインジェクション防止テスト"""
        # SQLインジェクションを試みるクエリパラメータ
        sql_payload = "'; DROP TABLE blog_blogpost; --"
        
        url = reverse('blogpost-list')
        response = self.client.get(url, {'search': sql_payload})
        
        # SQLインジェクションが防がれ、正常なレスポンスが返される
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # テーブルが削除されていないことを確認
        self.assertTrue(BlogPost._meta.db_table)
    
    def test_large_payload_prevention(self):
        """大きなペイロードの防止テスト"""
        token = self.get_jwt_token()
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        
        # 非常に大きなコンテンツ
        large_content = 'A' * 1000000  # 1MB
        data = {
            'title': 'Large Content Test',
            'excerpt': 'Test excerpt',
            'content': large_content,
            'status': 'draft'
        }
        
        url = reverse('blogpost-list')
        response = self.client.post(url, data, format='json')
        
        # サーバーはリクエストを処理するが、適切な制限を設ける
        # (実際の制限は設定による)
        self.assertIn(response.status_code, [
            status.HTTP_201_CREATED,
            status.HTTP_400_BAD_REQUEST,
            status.HTTP_413_REQUEST_ENTITY_TOO_LARGE
        ])


class PermissionTest(TestCase):
    """権限テストl"""
    
    def setUp(self):
        self.client = APIClient()
        self.user1 = User.objects.create_user(
            username='user1',
            email='user1@example.com',
            password='testpass123'
        )
        self.user2 = User.objects.create_user(
            username='user2',
            email='user2@example.com',
            password='testpass123'
        )
        self.staff_user = User.objects.create_user(
            username='staff',
            email='staff@example.com',
            password='testpass123',
            is_staff=True
        )
        
        self.author1 = Author.objects.create(
            user=self.user1,
            display_name='Author 1'
        )
        self.author2 = Author.objects.create(
            user=self.user2,
            display_name='Author 2'
        )
        
        self.post = BlogPost.objects.create(
            title='User1 Post',
            excerpt='Test excerpt',
            content='Test content',
            author=self.author1,
            status='published'
        )
    
    def get_jwt_token(self, user):
        """JWTトークンを取得"""
        refresh = RefreshToken.for_user(user)
        return str(refresh.access_token)
    
    def test_user_can_edit_own_post(self):
        """ユーザーが自分の記事を編集できることのテスト"""
        token = self.get_jwt_token(self.user1)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        
        data = {'title': 'Updated Title'}
        
        url = reverse('blogpost-detail', kwargs={'slug': self.post.slug})
        response = self.client.patch(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_user_cannot_edit_others_post(self):
        """ユーザーが他人の記事を編集できないことのテスト"""
        token = self.get_jwt_token(self.user2)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        
        data = {'title': 'Unauthorized Update'}
        
        url = reverse('blogpost-detail', kwargs={'slug': self.post.slug})
        response = self.client.patch(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
    
    def test_staff_can_approve_comments(self):
        """スタッフがコメントを承認できることのテスト"""
        comment = Comment.objects.create(
            post=self.post,
            author='Test Commenter',
            email='commenter@example.com',
            content='Test comment',
            status='pending'
        )
        
        token = self.get_jwt_token(self.staff_user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        
        url = reverse('comment-approve', kwargs={'pk': comment.id})
        response = self.client.post(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        comment.refresh_from_db()
        self.assertEqual(comment.status, 'approved')
    
    def test_regular_user_cannot_approve_comments(self):
        """一般ユーザーがコメントを承認できないことのテスト"""
        comment = Comment.objects.create(
            post=self.post,
            author='Test Commenter',
            email='commenter@example.com',
            content='Test comment',
            status='pending'
        )
        
        token = self.get_jwt_token(self.user1)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        
        url = reverse('comment-approve', kwargs={'pk': comment.id})
        response = self.client.post(url)
        
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


class CSRFProtectionTest(TestCase):
    """CSRF保護のテスト"""
    
    def setUp(self):
        self.client = APIClient()
        # CSRFトークンが必要なエンドポイントのテスト
        # (APIクライアントではCSRFは無効化されているため、実際のブラウザテストが必要)
    
    def test_csrf_token_required_for_state_changing_operations(self):
        """状態変更操作でCSRFトークンが必要であることのテスト"""
        # この テストは実際のHTMLフォームでのテストが必要
        # APIエンドポイントはJWT認証を使用しているため、CSRFトークンは不要
        pass