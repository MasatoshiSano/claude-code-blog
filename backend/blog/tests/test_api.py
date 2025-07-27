from django.test import TestCase
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from blog.models import Author, Category, Tag, BlogPost, Comment

User = get_user_model()


class BlogPostAPITest(TestCase):
    """ブログ記事APIのテスト"""
    
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
        self.category = Category.objects.create(name='Technology')
        self.tag1 = Tag.objects.create(name='Python')
        self.tag2 = Tag.objects.create(name='Django')
        
        # テスト用記事を作成
        self.post = BlogPost.objects.create(
            title='Test Post',
            excerpt='This is a test post',
            content='This is the content of the test post.',
            author=self.author,
            category=self.category,
            status='published'
        )
        self.post.tags.add(self.tag1, self.tag2)
    
    def get_jwt_token(self, user):
        """JWTトークンを取得"""
        refresh = RefreshToken.for_user(user)
        return str(refresh.access_token)
    
    def test_get_blog_posts_list(self):
        """記事一覧取得のテスト"""
        url = '/api/blog/posts/'
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['title'], 'Test Post')
    
    def test_get_blog_post_detail(self):
        """記事詳細取得のテスト"""
        url = f'/api/blog/posts/{self.post.slug}/'
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'Test Post')
        self.assertEqual(response.data['author']['display_name'], 'Test Author')
    
    def test_create_blog_post_authenticated(self):
        """認証済みユーザーの記事作成テスト"""
        token = self.get_jwt_token(self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        
        data = {
            'title': 'New Test Post',
            'excerpt': 'This is a new test post',
            'content': 'This is the content of the new test post.',
            'category': self.category.slug,
            'tags': [self.tag1.slug],
            'status': 'draft'
        }
        
        url = '/api/blog/posts/'
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(BlogPost.objects.count(), 2)
        
        new_post = BlogPost.objects.get(title='New Test Post')
        self.assertEqual(new_post.author, self.author)
    
    def test_create_blog_post_unauthenticated(self):
        """未認証ユーザーの記事作成テスト"""
        data = {
            'title': 'Unauthorized Post',
            'excerpt': 'This should not be created',
            'content': 'Unauthorized content',
        }
        
        url = '/api/blog/posts/'
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_update_blog_post_owner(self):
        """記事所有者による更新テスト"""
        token = self.get_jwt_token(self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        
        data = {
            'title': 'Updated Test Post',
            'excerpt': 'Updated excerpt',
            'content': 'Updated content',
            'status': 'published'
        }
        
        url = f'/api/blog/posts/{self.post.slug}/'
        response = self.client.patch(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        self.post.refresh_from_db()
        self.assertEqual(self.post.title, 'Updated Test Post')
    
    def test_update_blog_post_non_owner(self):
        """記事非所有者による更新テスト"""
        other_user = User.objects.create_user(
            username='otheruser',
            email='other@example.com',
            password='otherpass123'
        )
        token = self.get_jwt_token(other_user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        
        data = {'title': 'Unauthorized Update'}
        
        url = f'/api/blog/posts/{self.post.slug}/'
        response = self.client.patch(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
    
    def test_blog_post_search(self):
        """記事検索のテスト"""
        url = '/api/blog/search/'
        response = self.client.get(url, {'q': 'Test'})
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
    
    def test_blog_post_filter_by_category(self):
        """カテゴリフィルターのテスト"""
        url = '/api/blog/posts/'
        response = self.client.get(url, {'category': self.category.slug})
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
    
    def test_blog_post_filter_by_tag(self):
        """タグフィルターのテスト"""
        url = '/api/blog/posts/'
        response = self.client.get(url, {'tags': self.tag1.slug})
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)


class CategoryAPITest(TestCase):
    """カテゴリAPIのテスト"""
    
    def setUp(self):
        self.client = APIClient()
        self.category = Category.objects.create(
            name='Technology',
            description='Tech articles',
            color='#6366f1'
        )
    
    def test_get_categories_list(self):
        """カテゴリ一覧取得のテスト"""
        url = '/api/blog/categories/'
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['name'], 'Technology')
    
    def test_get_category_detail(self):
        """カテゴリ詳細取得のテスト"""
        url = f'/api/blog/categories/{self.category.slug}/'
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Technology')
        self.assertEqual(response.data['description'], 'Tech articles')


class TagAPITest(TestCase):
    """タグAPIのテスト"""
    
    def setUp(self):
        self.client = APIClient()
        self.tag = Tag.objects.create(name='Python')
    
    def test_get_tags_list(self):
        """タグ一覧取得のテスト"""
        url = '/api/blog/tags/'
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['name'], 'Python')
    
    def test_get_tag_detail(self):
        """タグ詳細取得のテスト"""
        url = f'/api/blog/tags/{self.tag.slug}/'
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Python')


class AuthorAPITest(TestCase):
    """著者APIのテスト"""
    
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
    
    def test_get_authors_list(self):
        """著者一覧取得のテスト"""
        url = '/api/blog/authors/'
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['display_name'], 'Test Author')
    
    def test_get_author_detail(self):
        """著者詳細取得のテスト"""
        url = f'/api/blog/authors/{self.author.slug}/'
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['display_name'], 'Test Author')
        self.assertEqual(response.data['email'], 'test@example.com')


class CommentAPITest(TestCase):
    """コメントAPIのテスト"""
    
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
        self.comment = Comment.objects.create(
            post=self.post,
            author='Test Commenter',
            email='commenter@example.com',
            content='This is a test comment.',
            status='approved'
        )
    
    def get_jwt_token(self, user):
        """JWTトークンを取得"""
        refresh = RefreshToken.for_user(user)
        return str(refresh.access_token)
    
    def test_get_comments_list(self):
        """コメント一覧取得のテスト"""
        url = '/api/blog/comments/'
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
    
    def test_create_comment(self):
        """コメント作成のテスト"""
        data = {
            'post': self.post.id,
            'author': 'New Commenter',
            'email': 'new@example.com',
            'content': 'This is a new comment.'
        }
        
        url = '/api/blog/comments/'
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Comment.objects.count(), 2)
        
        new_comment = Comment.objects.get(author='New Commenter')
        self.assertEqual(new_comment.status, 'pending')  # 新しいコメントはpending状態
    
    def test_approve_comment_staff(self):
        """スタッフによるコメント承認テスト"""
        self.user.is_staff = True
        self.user.save()
        
        token = self.get_jwt_token(self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        
        pending_comment = Comment.objects.create(
            post=self.post,
            author='Pending Commenter',
            email='pending@example.com',
            content='Pending comment.',
            status='pending'
        )
        
        url = f'/api/blog/comments/{pending_comment.id}/approve/'
        response = self.client.post(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        pending_comment.refresh_from_db()
        self.assertEqual(pending_comment.status, 'approved')
    
    def test_approve_comment_non_staff(self):
        """非スタッフによるコメント承認テスト"""
        token = self.get_jwt_token(self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        
        url = f'/api/blog/comments/{self.comment.id}/approve/'
        response = self.client.post(url)
        
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)