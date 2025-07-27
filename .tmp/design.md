# 詳細設計書 - Django REST Framework バックエンド移行

## 1. アーキテクチャ概要

### 1.1 システム構成図

```
Frontend (Next.js 14)          Backend (Django + DRF)          Database
┌─────────────────────┐       ┌─────────────────────────┐      ┌─────────────────┐
│                     │       │                         │      │                 │
│  Next.js App        │◄─────►│  Django REST Framework  │◄────►│  PostgreSQL     │
│  - Pages/Components │ HTTP  │  - API Endpoints        │      │  - Blog Data    │
│  - NextAuth.js      │ CORS  │  - Authentication       │      │  - User Data    │
│  - State Management │       │  - Business Logic       │      │  - Session Data │
│                     │       │                         │      │                 │
└─────────────────────┘       └─────────────────────────┘      └─────────────────┘
         │                              │                              │
         │                              │                              │
         └──────────── JWT Token ───────┴─── Database Connection ──────┘

Docker Containers:
┌─────────────────────────────────────────────────────────────────────────────┐
│  docker-compose.yml                                                         │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐              │
│  │   Next.js       │  │    Django       │  │   PostgreSQL    │              │
│  │   Container     │  │   Container     │  │   Container     │              │
│  │   Port: 3003    │  │   Port: 8000    │  │   Port: 5432    │              │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 1.2 技術スタック

**言語・フレームワーク:**
- Python 3.9+
- Django 4.2+ LTS
- Django REST Framework 3.14+
- django-allauth 0.57+

**データベース:**
- PostgreSQL 15+ (本番環境)
- SQLite 3 (開発環境)

**認証・セキュリティ:**
- django-allauth (認証管理)
- djangorestframework-simplejwt (JWT実装)
- django-cors-headers (CORS設定)
- django-environ (環境変数管理)

**開発・デプロイ:**
- Docker & Docker Compose
- gunicorn (WSGIサーバー)
- nginx (リバースプロキシ)

## 2. データベース設計

### 2.1 Django Models

#### 2.1.1 User Model (Django標準拡張)

```python
from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
    bio = models.TextField(max_length=500, blank=True)
    articles_count = models.PositiveIntegerField(default=0)
    
    def __str__(self):
        return self.username
```

#### 2.1.2 Author Model

```python
class SocialLink(models.Model):
    author = models.ForeignKey('Author', on_delete=models.CASCADE, related_name='social_links')
    platform = models.CharField(max_length=50)
    url = models.URLField()
    icon = models.CharField(max_length=100, blank=True)

class Author(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    display_name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.display_name
```

#### 2.1.3 Category & Tag Models

```python
class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True)
    color = models.CharField(max_length=7, default='#6366f1')  # HEX color
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name_plural = 'categories'
    
    def __str__(self):
        return self.name

class Tag(models.Model):
    name = models.CharField(max_length=50, unique=True)
    slug = models.SlugField(unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.name
```

#### 2.1.4 BlogPost Model

```python
class BlogPost(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('published', 'Published'),
    ]
    
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    excerpt = models.TextField(max_length=300)
    content = models.TextField()
    author = models.ForeignKey(Author, on_delete=models.CASCADE, related_name='posts')
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='posts')
    tags = models.ManyToManyField(Tag, related_name='posts')
    featured_image = models.URLField(blank=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='draft')
    
    # SEO fields
    meta_title = models.CharField(max_length=60, blank=True)
    meta_description = models.CharField(max_length=160, blank=True)
    keywords = models.JSONField(default=list, blank=True)
    og_image = models.URLField(blank=True)
    
    published_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-published_at', '-created_at']
    
    def __str__(self):
        return self.title
```

#### 2.1.5 Comment Model

```python
class Comment(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]
    
    post = models.ForeignKey(BlogPost, on_delete=models.CASCADE, related_name='comments')
    author_name = models.CharField(max_length=100)
    author_email = models.EmailField()
    content = models.TextField(max_length=1000)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['created_at']
    
    def __str__(self):
        return f'Comment by {self.author_name} on {self.post.title}'
```

### 2.2 データベース関係図

```
User (1) ←→ (1) Author (1) ←→ (n) BlogPost
                                   ↑
                                   │
Category (1) ←→ (n) BlogPost (n) ←→ (n) Tag
                                   ↑
                                   │
                             Comment (n) ←→ (1) BlogPost
```

## 3. API設計

### 3.1 DRF Serializers

#### 3.1.1 Base Serializers

```python
from rest_framework import serializers
from .models import *

class AuthorSerializer(serializers.ModelSerializer):
    social_links = SocialLinkSerializer(many=True, read_only=True)
    
    class Meta:
        model = Author
        fields = ['id', 'display_name', 'slug', 'user__email', 'user__bio', 
                 'user__avatar', 'user__articles_count', 'social_links']

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description', 'color']

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name', 'slug']

class BlogPostListSerializer(serializers.ModelSerializer):
    author = AuthorSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    
    class Meta:
        model = BlogPost
        fields = ['id', 'title', 'slug', 'excerpt', 'author', 'category', 
                 'tags', 'featured_image', 'published_at', 'meta_title', 
                 'meta_description']

class BlogPostDetailSerializer(serializers.ModelSerializer):
    author = AuthorSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    
    class Meta:
        model = BlogPost
        fields = '__all__'

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['id', 'post_id', 'author_name', 'author_email', 
                 'content', 'status', 'created_at']
```

### 3.2 API Endpoints

#### 3.2.1 URL Structure

```python
# urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()
router.register(r'posts', BlogPostViewSet)
router.register(r'categories', CategoryViewSet)
router.register(r'tags', TagViewSet)
router.register(r'authors', AuthorViewSet)
router.register(r'comments', CommentViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/auth/', include('dj_rest_auth.urls')),
    path('api/auth/registration/', include('dj_rest_auth.registration.urls')),
    path('api/posts/<slug:slug>/', BlogPostDetailView.as_view(), name='post-detail'),
    path('api/search/', SearchAPIView.as_view(), name='search'),
]
```

#### 3.2.2 ViewSets実装

```python
from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .serializers import *
from .filters import BlogPostFilter

class BlogPostViewSet(viewsets.ModelViewSet):
    queryset = BlogPost.objects.filter(status='published').select_related('author', 'category').prefetch_related('tags')
    serializer_class = BlogPostListSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = BlogPostFilter
    search_fields = ['title', 'excerpt', 'content']
    ordering_fields = ['published_at', 'created_at']
    ordering = ['-published_at']
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return BlogPostDetailSerializer
        return BlogPostListSerializer
    
    @action(detail=True, methods=['get'])
    def comments(self, request, pk=None):
        post = self.get_object()
        comments = Comment.objects.filter(post=post, status='approved')
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data)
```

### 3.3 認証エンドポイント仕様

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| POST | `/api/auth/login/` | ユーザーログイン | None |
| POST | `/api/auth/logout/` | ユーザーログアウト | JWT Token |
| POST | `/api/auth/registration/` | ユーザー登録 | None |
| GET | `/api/auth/user/` | 現在ユーザー情報 | JWT Token |
| POST | `/api/auth/password/reset/` | パスワードリセット | None |
| POST | `/api/auth/token/refresh/` | JWTトークン更新 | Refresh Token |

### 3.4 ブログAPI仕様

| Method | Endpoint | Description | Filters | Pagination |
|--------|----------|-------------|---------|------------|
| GET | `/api/posts/` | 記事一覧 | category, tag, search | 20件/page |
| GET | `/api/posts/{id}/` | 記事詳細 | - | - |
| GET | `/api/posts/{slug}/` | 記事詳細(slug) | - | - |
| GET | `/api/categories/` | カテゴリ一覧 | - | - |
| GET | `/api/tags/` | タグ一覧 | - | - |
| GET | `/api/authors/` | 著者一覧 | - | - |
| GET | `/api/comments/` | コメント一覧 | post_id, status | 20件/page |
| POST | `/api/comments/` | コメント投稿 | - | - |

## 4. 認証・認可設計

### 4.1 認証フロー

```
NextAuth.js (Frontend)           Django Backend
┌─────────────────────┐         ┌─────────────────────┐
│                     │         │                     │
│ 1. User Login       │────────►│ 2. Validate User    │
│                     │         │    (django-allauth) │
│                     │         │                     │
│ 4. Store JWT Token  │◄────────│ 3. Generate JWT     │
│                     │         │    (simplejwt)      │
│                     │         │                     │
│ 5. API Requests     │────────►│ 6. Verify JWT       │
│    with JWT Header  │         │    & Process        │
│                     │         │                     │
└─────────────────────┘         └─────────────────────┘
```

### 4.2 JWT設定

```python
# settings.py
from datetime import timedelta

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'ALGORITHM': 'HS256',
    'SIGNING_KEY': SECRET_KEY,
    'AUTH_HEADER_TYPES': ('Bearer',),
}

REST_AUTH_SERIALIZERS = {
    'LOGIN_SERIALIZER': 'authentication.serializers.CustomLoginSerializer',
    'USER_DETAILS_SERIALIZER': 'authentication.serializers.UserSerializer',
}
```

### 4.3 権限設定

```python
from rest_framework.permissions import BasePermission, SAFE_METHODS

class IsAuthorOrReadOnly(BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        return obj.author.user == request.user

class IsOwnerOrReadOnly(BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        return obj.user == request.user
```

## 5. セキュリティ設計

### 5.1 CORS設定

```python
# settings.py
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3003",
    "http://127.0.0.1:3003",
    # 本番ドメインを追加
]

CORS_ALLOW_CREDENTIALS = True

CORS_ALLOWED_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
]
```

### 5.2 セキュリティミドルウェア

```python
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# セキュリティ設定
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = 'DENY'
```

### 5.3 データバリデーション

```python
from rest_framework import serializers
import bleach

class CommentSerializer(serializers.ModelSerializer):
    def validate_content(self, value):
        # HTMLタグの除去とサニタイゼーション
        cleaned_content = bleach.clean(value, tags=[], strip=True)
        if len(cleaned_content) < 10:
            raise serializers.ValidationError("コメントは10文字以上で入力してください。")
        return cleaned_content
```

## 6. Docker設定

### 6.1 Dockerfile

```dockerfile
# Dockerfile
FROM python:3.9-slim

# 作業ディレクトリの設定
WORKDIR /app

# システムの依存関係をインストール
RUN apt-get update && apt-get install -y \
    postgresql-client \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Pythonの依存関係をインストール
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# アプリケーションコードをコピー
COPY . .

# 静的ファイルの収集
RUN python manage.py collectstatic --noinput

# ポートを公開
EXPOSE 8000

# アプリケーションを起動
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "blog_project.wsgi:application"]
```

### 6.2 docker-compose.yml

```yaml
version: '3.8'

services:
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: blog_db
      POSTGRES_USER: blog_user
      POSTGRES_PASSWORD: blog_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  backend:
    build: ./backend
    ports:
      - "8000:8000"
    volumes:
      - ./backend:/app
      - static_volume:/app/staticfiles
    environment:
      - DEBUG=1
      - DATABASE_URL=postgres://blog_user:blog_password@db:5432/blog_db
    depends_on:
      - db

  frontend:
    build: ./
    ports:
      - "3003:3003"
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:8000/api
    depends_on:
      - backend

volumes:
  postgres_data:
  static_volume:
```

## 7. テスト戦略

### 7.1 テスト構成

```python
# tests/test_models.py
from django.test import TestCase
from django.contrib.auth import get_user_model
from blog.models import Author, Category, BlogPost

class BlogPostModelTest(TestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        self.author = Author.objects.create(
            user=self.user,
            display_name='Test Author',
            slug='test-author'
        )
        self.category = Category.objects.create(
            name='Test Category',
            slug='test-category'
        )

    def test_blog_post_creation(self):
        post = BlogPost.objects.create(
            title='Test Post',
            slug='test-post',
            content='Test content',
            author=self.author,
            category=self.category,
            status='published'
        )
        self.assertEqual(post.title, 'Test Post')
        self.assertEqual(str(post), 'Test Post')
```

### 7.2 API テスト

```python
# tests/test_api.py
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from blog.models import BlogPost

class BlogPostAPITest(APITestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        
    def test_get_blog_posts(self):
        url = '/api/posts/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
    def test_create_comment_unauthenticated(self):
        url = '/api/comments/'
        data = {
            'post_id': 1,
            'author_name': 'Test User',
            'author_email': 'test@example.com',
            'content': 'Test comment'
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
```

### 7.3 テストカバレッジ

```bash
# テスト実行とカバレッジ測定
coverage run --source='.' manage.py test
coverage report
coverage html
```

**目標カバレッジ: 80%以上**

## 8. パフォーマンス最適化

### 8.1 データベース最適化

```python
# models.py - インデックス追加
class BlogPost(models.Model):
    # ... fields ...
    
    class Meta:
        ordering = ['-published_at', '-created_at']
        indexes = [
            models.Index(fields=['status', '-published_at']),
            models.Index(fields=['category', '-published_at']),
            models.Index(fields=['slug']),
        ]

# views.py - クエリ最適化
class BlogPostViewSet(viewsets.ModelViewSet):
    def get_queryset(self):
        return BlogPost.objects.filter(status='published') \
            .select_related('author', 'category') \
            .prefetch_related('tags') \
            .only('id', 'title', 'slug', 'excerpt', 'featured_image', 
                  'published_at', 'author__display_name', 'category__name')
```

### 8.2 キャッシュ戦略

```python
# settings.py
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.redis.RedisCache',
        'LOCATION': 'redis://127.0.0.1:6379/1',
    }
}

# views.py
from django.core.cache import cache
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page

@method_decorator(cache_page(60 * 15), name='list')  # 15分キャッシュ
class BlogPostViewSet(viewsets.ModelViewSet):
    # ...
```

### 8.3 ページネーション

```python
# settings.py
REST_FRAMEWORK = {
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
    'MAX_PAGE_SIZE': 100,
}
```

## 9. 運用・監視

### 9.1 ログ設定

```python
# settings.py
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {process:d} {thread:d} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'file': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'filename': 'django.log',
            'formatter': 'verbose',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['file'],
            'level': 'INFO',
            'propagate': True,
        },
    },
}
```

### 9.2 ヘルスチェック

```python
# health/views.py
from django.http import JsonResponse
from django.db import connection

def health_check(request):
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
        return JsonResponse({'status': 'healthy'})
    except Exception as e:
        return JsonResponse({'status': 'unhealthy', 'error': str(e)}, status=500)
```

## 10. 実装上の注意事項

### 10.1 データ移行

- モックデータからDjangoモデルへの移行スクリプト作成
- 既存のslugとIDの整合性確保
- 段階的な移行（カテゴリ→タグ→著者→記事→コメント）

### 10.2 フロントエンド統合

- API レスポンス形式の完全互換性確保
- エラーハンドリングの統一
- 認証トークンの適切な管理

### 10.3 開発フロー

1. Dockerコンテナ起動 (`docker-compose up`)
2. データベースマイグレーション (`python manage.py migrate`)
3. 初期データ投入 (`python manage.py loaddata fixtures/initial_data.json`)
4. テスト実行 (`python manage.py test`)
5. 開発サーバー起動 (`python manage.py runserver`)

### 10.4 本番デプロイ準備

- 環境変数の適切な設定
- 静的ファイルの配信設定
- データベースのバックアップ戦略
- SSL証明書の設定
- セキュリティヘッダーの設定