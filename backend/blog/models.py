from django.db import models
from django.conf import settings
from django.utils.text import slugify
from django.utils import timezone


class SocialLink(models.Model):
    """ソーシャルリンクモデル"""
    author = models.ForeignKey('Author', on_delete=models.CASCADE, related_name='social_links')
    platform = models.CharField(max_length=50, verbose_name='プラットフォーム')
    url = models.URLField(verbose_name='URL')
    icon = models.CharField(max_length=100, blank=True, verbose_name='アイコン')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'ソーシャルリンク'
        verbose_name_plural = 'ソーシャルリンク'
        unique_together = ['author', 'platform']
    
    def __str__(self):
        return f'{self.author.display_name} - {self.platform}'


class Author(models.Model):
    """著者モデル（UserとのOneToOne関係）"""
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='author_profile')
    display_name = models.CharField(max_length=100, verbose_name='表示名')
    slug = models.SlugField(unique=True, max_length=100, verbose_name='スラッグ')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = '著者'
        verbose_name_plural = '著者'
        indexes = [
            models.Index(fields=['slug']),
        ]
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.display_name)
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.display_name
    
    @property
    def name(self):
        """TypeScript型との互換性のためのプロパティ"""
        return self.display_name
    
    @property
    def email(self):
        """TypeScript型との互換性のためのプロパティ"""
        return self.user.email
    
    @property
    def avatar(self):
        """TypeScript型との互換性のためのプロパティ"""
        return self.user.avatar.url if self.user.avatar else None
    
    @property
    def bio(self):
        """TypeScript型との互換性のためのプロパティ"""
        return self.user.bio
    
    @property
    def articles_count(self):
        """TypeScript型との互換性のためのプロパティ"""
        return self.user.articles_count


class Category(models.Model):
    """カテゴリモデル"""
    name = models.CharField(max_length=100, unique=True, verbose_name='カテゴリ名')
    slug = models.SlugField(unique=True, max_length=100, verbose_name='スラッグ')
    description = models.TextField(blank=True, verbose_name='説明')
    color = models.CharField(max_length=7, default='#6366f1', verbose_name='カラーコード')  # HEX color
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'カテゴリ'
        verbose_name_plural = 'カテゴリ'
        indexes = [
            models.Index(fields=['slug']),
            models.Index(fields=['name']),
        ]
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.name


class Tag(models.Model):
    """タグモデル"""
    name = models.CharField(max_length=50, unique=True, verbose_name='タグ名')
    slug = models.SlugField(unique=True, max_length=50, verbose_name='スラッグ')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'タグ'
        verbose_name_plural = 'タグ'
        indexes = [
            models.Index(fields=['slug']),
            models.Index(fields=['name']),
        ]
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.name


class BlogPost(models.Model):
    """ブログ記事モデル"""
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('published', 'Published'),
    ]
    
    title = models.CharField(max_length=200, verbose_name='タイトル')
    slug = models.SlugField(unique=True, max_length=200, verbose_name='スラッグ')
    excerpt = models.TextField(max_length=300, verbose_name='抜粋')
    content = models.TextField(verbose_name='本文')
    author = models.ForeignKey(Author, on_delete=models.CASCADE, related_name='posts', verbose_name='著者')
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True, related_name='posts', verbose_name='カテゴリ')
    tags = models.ManyToManyField(Tag, related_name='posts', blank=True, verbose_name='タグ')
    featured_image = models.URLField(blank=True, verbose_name='アイキャッチ画像')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='draft', verbose_name='公開状態')
    
    # SEO関連フィールド
    meta_title = models.CharField(max_length=60, blank=True, verbose_name='SEOタイトル')
    meta_description = models.CharField(max_length=160, blank=True, verbose_name='SEO説明文')
    keywords = models.JSONField(default=list, blank=True, verbose_name='キーワード')
    og_image = models.URLField(blank=True, verbose_name='OGP画像')
    
    published_at = models.DateTimeField(null=True, blank=True, verbose_name='公開日時')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='作成日時')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='更新日時')
    
    class Meta:
        verbose_name = 'ブログ記事'
        verbose_name_plural = 'ブログ記事'
        ordering = ['-published_at', '-created_at']
        indexes = [
            models.Index(fields=['status', '-published_at']),
            models.Index(fields=['category', '-published_at']),
            models.Index(fields=['slug']),
            models.Index(fields=['author', '-published_at']),
        ]
    
    def save(self, *args, **kwargs):
        # スラッグの自動生成
        if not self.slug:
            self.slug = slugify(self.title)
        
        # 公開状態が'published'で公開日時が未設定の場合、現在時刻を設定
        if self.status == 'published' and not self.published_at:
            self.published_at = timezone.now()
        
        # SEOタイトルが未設定の場合、記事タイトルを使用
        if not self.meta_title:
            self.meta_title = self.title[:60]
        
        # SEO説明文が未設定の場合、抜粋を使用
        if not self.meta_description:
            self.meta_description = self.excerpt[:160]
        
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.title
    
    @property
    def seo(self):
        """TypeScript型との互換性のためのプロパティ"""
        return {
            'metaTitle': self.meta_title,
            'metaDescription': self.meta_description,
            'keywords': self.keywords,
            'ogImage': self.og_image,
        }
    
    @property
    def is_published(self):
        """公開状態かどうかを判定"""
        return self.status == 'published' and self.published_at is not None
    
    def get_absolute_url(self):
        """記事の絶対URLを取得"""
        return f'/blog/{self.slug}/'


class Comment(models.Model):
    """コメントモデル"""
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]
    
    post = models.ForeignKey(BlogPost, on_delete=models.CASCADE, related_name='comments', verbose_name='記事')
    author = models.CharField(max_length=100, verbose_name='投稿者名')
    email = models.EmailField(verbose_name='メールアドレス')
    content = models.TextField(verbose_name='コメント内容')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending', verbose_name='承認状態')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='投稿日時')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='更新日時')
    
    class Meta:
        verbose_name = 'コメント'
        verbose_name_plural = 'コメント'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['post', '-created_at']),
            models.Index(fields=['status', '-created_at']),
            models.Index(fields=['email']),
        ]
    
    def __str__(self):
        return f'{self.author} - {self.post.title[:30]}...'
    
    @property
    def post_id(self):
        """TypeScript型との互換性のためのプロパティ"""
        return str(self.post.id)
    
    @property
    def is_approved(self):
        """承認済みかどうかを判定"""
        return self.status == 'approved'