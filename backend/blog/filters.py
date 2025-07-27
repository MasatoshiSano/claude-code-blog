import django_filters
from django.db.models import Q, Count
from .models import BlogPost, Category, Tag, Author


class BlogPostFilter(django_filters.FilterSet):
    """ブログ記事用フィルター"""
    
    # カテゴリフィルター
    category = django_filters.ModelChoiceFilter(
        queryset=Category.objects.all(),
        field_name='category',
        to_field_name='slug',
        lookup_expr='exact'
    )
    
    # タグフィルター
    tags = django_filters.ModelMultipleChoiceFilter(
        queryset=Tag.objects.all(),
        field_name='tags',
        to_field_name='slug',
        lookup_expr='in'
    )
    
    # 著者フィルター
    author = django_filters.ModelChoiceFilter(
        queryset=Author.objects.all(),
        field_name='author',
        to_field_name='slug',
        lookup_expr='exact'
    )
    
    # 日付範囲フィルター
    published_after = django_filters.DateFilter(
        field_name='published_at',
        lookup_expr='gte'
    )
    
    published_before = django_filters.DateFilter(
        field_name='published_at',
        lookup_expr='lte'
    )
    
    # 年月フィルター
    year = django_filters.NumberFilter(
        field_name='published_at',
        lookup_expr='year'
    )
    
    month = django_filters.NumberFilter(
        field_name='published_at',
        lookup_expr='month'
    )
    
    # ステータスフィルター（管理者用）
    status = django_filters.ChoiceFilter(
        choices=BlogPost.STATUS_CHOICES,
        field_name='status'
    )
    
    # タイトルでの部分一致検索
    title = django_filters.CharFilter(
        field_name='title',
        lookup_expr='icontains'
    )
    
    # 複数フィールドでの検索
    search = django_filters.CharFilter(
        method='filter_search',
        label='全文検索'
    )
    
    # アイキャッチ画像有無フィルター
    has_featured_image = django_filters.BooleanFilter(
        method='filter_has_featured_image',
        label='アイキャッチ画像あり'
    )
    
    class Meta:
        model = BlogPost
        fields = {
            'created_at': ['exact', 'gte', 'lte', 'year', 'month'],
            'updated_at': ['exact', 'gte', 'lte'],
        }
    
    def filter_search(self, queryset, name, value):
        """複数フィールドでの検索"""
        if not value:
            return queryset
        
        return queryset.filter(
            Q(title__icontains=value) |
            Q(content__icontains=value) |
            Q(excerpt__icontains=value) |
            Q(author__display_name__icontains=value) |
            Q(tags__name__icontains=value) |
            Q(category__name__icontains=value)
        ).distinct()
    
    def filter_has_featured_image(self, queryset, name, value):
        """アイキャッチ画像の有無でフィルター"""
        if value is True:
            return queryset.filter(featured_image__isnull=False).exclude(featured_image='')
        elif value is False:
            return queryset.filter(Q(featured_image__isnull=True) | Q(featured_image=''))
        return queryset


class CategoryFilter(django_filters.FilterSet):
    """カテゴリ用フィルター"""
    
    name = django_filters.CharFilter(
        field_name='name',
        lookup_expr='icontains'
    )
    
    # 記事数でのフィルター
    min_posts = django_filters.NumberFilter(
        method='filter_min_posts',
        label='最小記事数'
    )
    
    class Meta:
        model = Category
        fields = ['name']
    
    def filter_min_posts(self, queryset, name, value):
        """最小記事数でフィルター"""
        if value is not None:
            return queryset.annotate(
                posts_count=Count('posts', filter=Q(posts__status='published'))
            ).filter(posts_count__gte=value)
        return queryset


class TagFilter(django_filters.FilterSet):
    """タグ用フィルター"""
    
    name = django_filters.CharFilter(
        field_name='name',
        lookup_expr='icontains'
    )
    
    # 記事数でのフィルター
    min_posts = django_filters.NumberFilter(
        method='filter_min_posts',
        label='最小記事数'
    )
    
    class Meta:
        model = Tag
        fields = ['name']
    
    def filter_min_posts(self, queryset, name, value):
        """最小記事数でフィルター"""
        if value is not None:
            return queryset.annotate(
                posts_count=Count('posts', filter=Q(posts__status='published'))
            ).filter(posts_count__gte=value)
        return queryset


class AuthorFilter(django_filters.FilterSet):
    """著者用フィルター"""
    
    display_name = django_filters.CharFilter(
        field_name='display_name',
        lookup_expr='icontains'
    )
    
    # ユーザー名での検索
    username = django_filters.CharFilter(
        field_name='user__username',
        lookup_expr='icontains'
    )
    
    # 記事数でのフィルター
    min_articles = django_filters.NumberFilter(
        method='filter_min_articles',
        label='最小記事数'
    )
    
    class Meta:
        model = Author
        fields = ['display_name']
    
    def filter_min_articles(self, queryset, name, value):
        """最小記事数でフィルター"""
        if value is not None:
            return queryset.annotate(
                articles_count=Count('posts', filter=Q(posts__status='published'))
            ).filter(articles_count__gte=value)
        return queryset