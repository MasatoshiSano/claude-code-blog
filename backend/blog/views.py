from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated, AllowAny
from rest_framework.exceptions import PermissionDenied
from rest_framework.generics import get_object_or_404
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q, Count
from django.utils import timezone
from .models import Author, Category, Tag, BlogPost, Comment, SocialLink
from .serializers import (
    AuthorListSerializer, AuthorDetailSerializer,
    CategorySerializer, TagSerializer,
    BlogPostListSerializer, BlogPostDetailSerializer, BlogPostCreateUpdateSerializer,
    CommentSerializer, CommentCreateSerializer,
    SocialLinkSerializer
)
from .filters import BlogPostFilter
from .throttling import CommentRateThrottle, SearchRateThrottle


class AuthorViewSet(viewsets.ReadOnlyModelViewSet):
    """著者ViewSet"""
    queryset = Author.objects.all()
    lookup_field = 'slug'
    permission_classes = [AllowAny]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['display_name', 'user__email']
    ordering_fields = ['display_name', 'created_at']
    ordering = ['display_name']
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return AuthorDetailSerializer
        return AuthorListSerializer
    
    def get_queryset(self):
        return Author.objects.select_related('user').prefetch_related('social_links')
    
    @action(detail=True, methods=['get'])
    def posts(self, request, slug=None):
        """著者の記事一覧を取得"""
        author = self.get_object()
        posts = BlogPost.objects.filter(
            author=author,
            status='published'
        ).select_related('author', 'category').prefetch_related('tags')
        
        # ページネーション適用
        page = self.paginate_queryset(posts)
        if page is not None:
            serializer = BlogPostListSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = BlogPostListSerializer(posts, many=True)
        return Response(serializer.data)


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """カテゴリViewSet"""
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    lookup_field = 'slug'
    permission_classes = [AllowAny]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_at']
    ordering = ['name']
    
    def get_queryset(self):
        return Category.objects.annotate(
            posts_count=Count('posts', filter=Q(posts__status='published'))
        )
    
    @action(detail=True, methods=['get'])
    def posts(self, request, slug=None):
        """カテゴリの記事一覧を取得"""
        category = self.get_object()
        posts = BlogPost.objects.filter(
            category=category,
            status='published'
        ).select_related('author', 'category').prefetch_related('tags')
        
        page = self.paginate_queryset(posts)
        if page is not None:
            serializer = BlogPostListSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = BlogPostListSerializer(posts, many=True)
        return Response(serializer.data)


class TagViewSet(viewsets.ReadOnlyModelViewSet):
    """タグViewSet"""
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    lookup_field = 'slug'
    permission_classes = [AllowAny]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name']
    ordering_fields = ['name', 'created_at']
    ordering = ['name']
    
    def get_queryset(self):
        return Tag.objects.annotate(
            posts_count=Count('posts', filter=Q(posts__status='published'))
        )
    
    @action(detail=True, methods=['get'])
    def posts(self, request, slug=None):
        """タグの記事一覧を取得"""
        tag = self.get_object()
        posts = BlogPost.objects.filter(
            tags=tag,
            status='published'
        ).select_related('author', 'category').prefetch_related('tags')
        
        page = self.paginate_queryset(posts)
        if page is not None:
            serializer = BlogPostListSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = BlogPostListSerializer(posts, many=True)
        return Response(serializer.data)


class BlogPostViewSet(viewsets.ModelViewSet):
    """ブログ記事ViewSet"""
    permission_classes = [IsAuthenticatedOrReadOnly]
    lookup_field = 'slug'
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = BlogPostFilter
    search_fields = ['title', 'content', 'excerpt', 'author__display_name']
    ordering_fields = ['created_at', 'updated_at', 'published_at', 'title']
    ordering = ['-published_at', '-created_at']
    
    def get_queryset(self):
        queryset = BlogPost.objects.select_related('author', 'category').prefetch_related('tags', 'comments')
        
        # 一般ユーザーには公開済み記事のみ表示
        if not self.request.user.is_authenticated or not self.request.user.is_staff:
            queryset = queryset.filter(status='published')
        
        return queryset
    
    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return BlogPostCreateUpdateSerializer
        elif self.action == 'retrieve':
            return BlogPostDetailSerializer
        return BlogPostListSerializer
    
    def perform_create(self, serializer):
        # 記事作成時に著者を設定
        if hasattr(self.request.user, 'author_profile'):
            serializer.save(author=self.request.user.author_profile)
        else:
            # 著者プロファイルがない場合は作成
            from .models import Author
            from django.utils.text import slugify
            author = Author.objects.create(
                user=self.request.user,
                display_name=f"{self.request.user.first_name} {self.request.user.last_name}".strip() or self.request.user.username,
                slug=slugify(self.request.user.username)
            )
            serializer.save(author=author)
    
    def perform_update(self, serializer):
        # 更新時に所有者チェック
        if not self.request.user.is_staff and self.get_object().author.user != self.request.user:
            raise PermissionDenied("他のユーザーの記事は編集できません。")
        serializer.save()
    
    @action(detail=True, methods=['get'])
    def comments(self, request, slug=None):
        """記事のコメント一覧を取得"""
        post = self.get_object()
        comments = Comment.objects.filter(
            post=post,
            status='approved'
        ).order_by('-created_at')
        
        page = self.paginate_queryset(comments)
        if page is not None:
            serializer = CommentSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def featured(self, request):
        """おすすめ記事を取得"""
        posts = self.get_queryset().filter(
            featured_image__isnull=False
        )[:5]
        serializer = BlogPostListSerializer(posts, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def recent(self, request):
        """最新記事を取得"""
        posts = self.get_queryset()[:10]
        serializer = BlogPostListSerializer(posts, many=True)
        return Response(serializer.data)


class CommentViewSet(viewsets.ModelViewSet):
    """コメントViewSet"""
    queryset = Comment.objects.all()
    permission_classes = [IsAuthenticatedOrReadOnly]
    throttle_classes = [CommentRateThrottle]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['post', 'status']
    ordering_fields = ['created_at']
    ordering = ['-created_at']
    
    def get_queryset(self):
        queryset = Comment.objects.select_related('post')
        
        # 一般ユーザーには承認済みコメントのみ表示
        if not self.request.user.is_authenticated or not self.request.user.is_staff:
            queryset = queryset.filter(status='approved')
        
        return queryset
    
    def get_serializer_class(self):
        if self.action == 'create':
            return CommentCreateSerializer
        return CommentSerializer
    
    def perform_create(self, serializer):
        # コメント作成時はpending状態で保存
        serializer.save(status='pending')
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def approve(self, request, pk=None):
        """コメントを承認"""
        if not request.user.is_staff:
            return Response(
                {'error': '管理者権限が必要です。'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        comment = self.get_object()
        comment.status = 'approved'
        comment.save()
        
        serializer = CommentSerializer(comment)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def reject(self, request, pk=None):
        """コメントを拒否"""
        if not request.user.is_staff:
            return Response(
                {'error': '管理者権限が必要です。'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        comment = self.get_object()
        comment.status = 'rejected'
        comment.save()
        
        serializer = CommentSerializer(comment)
        return Response(serializer.data)


class BlogPostDetailView(APIView):
    """ブログ記事詳細取得（スラッグベース）"""
    permission_classes = [AllowAny]
    
    def get(self, request, slug):
        try:
            post = BlogPost.objects.select_related('author', 'category').prefetch_related('tags', 'comments').get(slug=slug)
            
            # 非公開記事は管理者のみ閲覧可能
            if post.status != 'published' and (not request.user.is_authenticated or not request.user.is_staff):
                return Response(
                    {'error': '記事が見つかりません。'},
                    status=status.HTTP_404_NOT_FOUND
                )
            
            serializer = BlogPostDetailSerializer(post)
            return Response(serializer.data)
        except BlogPost.DoesNotExist:
            return Response(
                {'error': '記事が見つかりません。'},
                status=status.HTTP_404_NOT_FOUND
            )


class SearchAPIView(APIView):
    """検索API"""
    permission_classes = [AllowAny]
    throttle_classes = [SearchRateThrottle]
    
    def get(self, request):
        query = request.GET.get('q', '').strip()
        category = request.GET.get('category', '').strip()
        tag = request.GET.get('tag', '').strip()
        
        if not query and not category and not tag:
            return Response({'results': [], 'count': 0})
        
        # ベースクエリセット
        posts = BlogPost.objects.filter(status='published').select_related('author', 'category').prefetch_related('tags')
        
        # 検索条件の適用
        if query:
            posts = posts.filter(
                Q(title__icontains=query) |
                Q(content__icontains=query) |
                Q(excerpt__icontains=query) |
                Q(author__display_name__icontains=query)
            )
        
        if category:
            posts = posts.filter(category__slug=category)
        
        if tag:
            posts = posts.filter(tags__slug=tag)
        
        # 重複除去とソート
        posts = posts.distinct().order_by('-published_at')
        
        # ページネーション
        from rest_framework.pagination import PageNumberPagination
        paginator = PageNumberPagination()
        paginator.page_size = 20
        page = paginator.paginate_queryset(posts, request)
        
        if page is not None:
            serializer = BlogPostListSerializer(page, many=True)
            return paginator.get_paginated_response(serializer.data)
        
        serializer = BlogPostListSerializer(posts, many=True)
        return Response({
            'results': serializer.data,
            'count': posts.count()
        })