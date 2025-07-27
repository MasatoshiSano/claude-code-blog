from django.contrib import admin
from .models import SocialLink, Author, Category, Tag, BlogPost, Comment


class SocialLinkInline(admin.TabularInline):
    model = SocialLink
    extra = 1


@admin.register(Author)
class AuthorAdmin(admin.ModelAdmin):
    list_display = ['display_name', 'user', 'slug', 'created_at']
    list_filter = ['created_at', 'updated_at']
    search_fields = ['display_name', 'user__email', 'user__username']
    readonly_fields = ['created_at', 'updated_at']
    prepopulated_fields = {'slug': ('display_name',)}
    inlines = [SocialLinkInline]
    
    fieldsets = (
        ('基本情報', {
            'fields': ('user', 'display_name', 'slug')
        }),
        ('日時情報', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(SocialLink)
class SocialLinkAdmin(admin.ModelAdmin):
    list_display = ['author', 'platform', 'url', 'created_at']
    list_filter = ['platform', 'created_at']
    search_fields = ['author__display_name', 'platform', 'url']


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'color', 'created_at']
    list_filter = ['created_at']
    search_fields = ['name', 'slug']
    prepopulated_fields = {'slug': ('name',)}
    readonly_fields = ['created_at']
    
    fieldsets = (
        ('基本情報', {
            'fields': ('name', 'slug', 'description', 'color')
        }),
        ('日時情報', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'created_at']
    list_filter = ['created_at']
    search_fields = ['name', 'slug']
    prepopulated_fields = {'slug': ('name',)}
    readonly_fields = ['created_at']
    
    fieldsets = (
        ('基本情報', {
            'fields': ('name', 'slug')
        }),
        ('日時情報', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )


@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display = ['title', 'author', 'category', 'status', 'published_at', 'created_at']
    list_filter = ['status', 'category', 'tags', 'created_at', 'published_at']
    search_fields = ['title', 'content', 'author__display_name']
    prepopulated_fields = {'slug': ('title',)}
    readonly_fields = ['created_at', 'updated_at']
    filter_horizontal = ['tags']
    
    fieldsets = (
        ('基本情報', {
            'fields': ('title', 'slug', 'author', 'category', 'status')
        }),
        ('コンテンツ', {
            'fields': ('excerpt', 'content', 'featured_image', 'tags')
        }),
        ('SEO設定', {
            'fields': ('meta_title', 'meta_description', 'keywords', 'og_image'),
            'classes': ('collapse',)
        }),
        ('日時情報', {
            'fields': ('published_at', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def save_model(self, request, obj, form, change):
        if not change and not obj.author_id:
            # 新規作成時に著者が未設定の場合、現在のユーザーの著者プロファイルを設定
            if hasattr(request.user, 'author_profile'):
                obj.author = request.user.author_profile
        super().save_model(request, obj, form, change)


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ['author', 'post', 'status', 'created_at', 'content_preview']
    list_filter = ['status', 'created_at', 'post__category']
    search_fields = ['author', 'email', 'content', 'post__title']
    readonly_fields = ['created_at', 'updated_at']
    list_per_page = 50
    
    fieldsets = (
        ('基本情報', {
            'fields': ('post', 'author', 'email', 'content')
        }),
        ('承認管理', {
            'fields': ('status',)
        }),
        ('日時情報', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def content_preview(self, obj):
        """コンテンツのプレビューを表示"""
        return obj.content[:50] + '...' if len(obj.content) > 50 else obj.content
    content_preview.short_description = 'コンテンツプレビュー'
    
    actions = ['approve_comments', 'reject_comments', 'mark_pending']
    
    def approve_comments(self, request, queryset):
        """選択されたコメントを承認"""
        count = queryset.update(status='approved')
        self.message_user(request, f'{count}件のコメントを承認しました。')
    approve_comments.short_description = '選択されたコメントを承認'
    
    def reject_comments(self, request, queryset):
        """選択されたコメントを拒否"""
        count = queryset.update(status='rejected')
        self.message_user(request, f'{count}件のコメントを拒否しました。')
    reject_comments.short_description = '選択されたコメントを拒否'
    
    def mark_pending(self, request, queryset):
        """選択されたコメントを保留にする"""
        count = queryset.update(status='pending')
        self.message_user(request, f'{count}件のコメントを保留にしました。')
    mark_pending.short_description = '選択されたコメントを保留にする'