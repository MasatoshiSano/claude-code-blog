from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Author, Category, Tag, BlogPost, Comment, SocialLink

User = get_user_model()


class SocialLinkSerializer(serializers.ModelSerializer):
    """ソーシャルリンクシリアライザー"""
    
    class Meta:
        model = SocialLink
        fields = ['id', 'platform', 'url', 'icon', 'created_at']
        read_only_fields = ['id', 'created_at']


class AuthorListSerializer(serializers.ModelSerializer):
    """著者一覧用シリアライザー"""
    name = serializers.ReadOnlyField()
    email = serializers.ReadOnlyField()
    avatar = serializers.ReadOnlyField()
    bio = serializers.ReadOnlyField()
    articles_count = serializers.ReadOnlyField()
    
    class Meta:
        model = Author
        fields = ['id', 'display_name', 'slug', 'name', 'email', 'avatar', 'bio', 'articles_count', 'created_at']
        read_only_fields = ['id', 'slug', 'created_at']


class AuthorDetailSerializer(serializers.ModelSerializer):
    """著者詳細用シリアライザー"""
    name = serializers.ReadOnlyField()
    email = serializers.ReadOnlyField()
    avatar = serializers.ReadOnlyField()
    bio = serializers.ReadOnlyField()
    articles_count = serializers.ReadOnlyField()
    social_links = SocialLinkSerializer(many=True, read_only=True)
    
    class Meta:
        model = Author
        fields = ['id', 'display_name', 'slug', 'name', 'email', 'avatar', 'bio', 
                 'articles_count', 'social_links', 'created_at', 'updated_at']
        read_only_fields = ['id', 'slug', 'created_at', 'updated_at']


class CategorySerializer(serializers.ModelSerializer):
    """カテゴリシリアライザー"""
    posts_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description', 'color', 'posts_count', 'created_at']
        read_only_fields = ['id', 'slug', 'created_at']
    
    def get_posts_count(self, obj):
        return obj.posts.filter(status='published').count()


class TagSerializer(serializers.ModelSerializer):
    """タグシリアライザー"""
    posts_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Tag
        fields = ['id', 'name', 'slug', 'posts_count', 'created_at']
        read_only_fields = ['id', 'slug', 'created_at']
    
    def get_posts_count(self, obj):
        return obj.posts.filter(status='published').count()


class BlogPostListSerializer(serializers.ModelSerializer):
    """ブログ記事一覧用シリアライザー"""
    author = AuthorListSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    seo = serializers.ReadOnlyField()
    comments_count = serializers.SerializerMethodField()
    reading_time = serializers.SerializerMethodField()
    
    class Meta:
        model = BlogPost
        fields = ['id', 'title', 'slug', 'excerpt', 'author', 'category', 'tags', 
                 'featured_image', 'status', 'published_at', 'updated_at', 'seo',
                 'comments_count', 'reading_time']
        read_only_fields = ['id', 'slug', 'published_at', 'updated_at']
    
    def get_comments_count(self, obj):
        return obj.comments.filter(status='approved').count()
    
    def get_reading_time(self, obj):
        # 平均読み速度を200文字/分として計算
        word_count = len(obj.content)
        reading_time = max(1, word_count // 200)
        return reading_time


class BlogPostDetailSerializer(serializers.ModelSerializer):
    """ブログ記事詳細用シリアライザー"""
    author = AuthorDetailSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    seo = serializers.ReadOnlyField()
    comments_count = serializers.SerializerMethodField()
    reading_time = serializers.SerializerMethodField()
    
    class Meta:
        model = BlogPost
        fields = ['id', 'title', 'slug', 'excerpt', 'content', 'author', 'category', 'tags',
                 'featured_image', 'status', 'published_at', 'created_at', 'updated_at', 
                 'seo', 'comments_count', 'reading_time']
        read_only_fields = ['id', 'slug', 'published_at', 'created_at', 'updated_at']
    
    def get_comments_count(self, obj):
        return obj.comments.filter(status='approved').count()
    
    def get_reading_time(self, obj):
        word_count = len(obj.content)
        reading_time = max(1, word_count // 200)
        return reading_time


class BlogPostCreateUpdateSerializer(serializers.ModelSerializer):
    """ブログ記事作成・更新用シリアライザー"""
    tags = serializers.SlugRelatedField(
        many=True,
        slug_field='slug',
        queryset=Tag.objects.all(),
        required=False
    )
    category = serializers.SlugRelatedField(
        slug_field='slug',
        queryset=Category.objects.all(),
        required=False,
        allow_null=True
    )
    
    class Meta:
        model = BlogPost
        fields = ['title', 'excerpt', 'content', 'category', 'tags', 'featured_image', 
                 'status', 'meta_title', 'meta_description', 'keywords', 'og_image']
    
    def validate_keywords(self, value):
        if isinstance(value, str):
            # 文字列の場合はリストに変換
            return [keyword.strip() for keyword in value.split(',') if keyword.strip()]
        return value


class CommentSerializer(serializers.ModelSerializer):
    """コメントシリアライザー"""
    post_id = serializers.ReadOnlyField()
    
    class Meta:
        model = Comment
        fields = ['id', 'post_id', 'author', 'email', 'content', 'status', 'created_at']
        read_only_fields = ['id', 'post_id', 'status', 'created_at']
    
    def validate_email(self, value):
        # メールアドレスの形式チェック
        return value.lower()


class CommentCreateSerializer(serializers.ModelSerializer):
    """コメント作成用シリアライザー"""
    
    class Meta:
        model = Comment
        fields = ['post', 'author', 'email', 'content']
    
    def validate_email(self, value):
        return value.lower()
    
    def create(self, validated_data):
        # 新しいコメントはデフォルトで'pending'状態
        validated_data['status'] = 'pending'
        return super().create(validated_data)