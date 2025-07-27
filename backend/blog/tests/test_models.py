from django.test import TestCase
from django.contrib.auth import get_user_model
from django.utils.text import slugify
from django.core.exceptions import ValidationError
from django.db import IntegrityError
from blog.models import Author, Category, Tag, BlogPost, Comment, SocialLink

User = get_user_model()


class AuthorModelTest(TestCase):
    """著者モデルのテスト"""
    
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
    
    def test_author_creation(self):
        """著者の作成テスト"""
        author = Author.objects.create(
            user=self.user,
            display_name='Test Author'
        )
        self.assertEqual(author.display_name, 'Test Author')
        self.assertEqual(author.slug, 'test-author')
        self.assertEqual(author.name, 'Test Author')
        self.assertEqual(author.email, 'test@example.com')
    
    def test_author_slug_auto_generation(self):
        """スラッグ自動生成のテスト"""
        author = Author.objects.create(
            user=self.user,
            display_name='テスト 著者'
        )
        self.assertTrue(author.slug)  # スラッグが生成されることを確認
    
    def test_author_str_method(self):
        """__str__メソッドのテスト"""
        author = Author.objects.create(
            user=self.user,
            display_name='Test Author'
        )
        self.assertEqual(str(author), 'Test Author')
    
    def test_author_properties(self):
        """プロパティのテスト"""
        self.user.first_name = 'John'
        self.user.last_name = 'Doe'
        self.user.bio = 'Test bio'
        self.user.save()
        
        author = Author.objects.create(
            user=self.user,
            display_name='Test Author'
        )
        
        self.assertEqual(author.name, 'Test Author')
        self.assertEqual(author.email, 'test@example.com')
        self.assertEqual(author.bio, 'Test bio')


class CategoryModelTest(TestCase):
    """カテゴリモデルのテスト"""
    
    def test_category_creation(self):
        """カテゴリの作成テスト"""
        category = Category.objects.create(
            name='Technology',
            description='Tech articles'
        )
        self.assertEqual(category.name, 'Technology')
        self.assertEqual(category.slug, 'technology')
        self.assertEqual(category.description, 'Tech articles')
    
    def test_category_unique_name(self):
        """カテゴリ名の一意性テスト"""
        Category.objects.create(name='Technology')
        with self.assertRaises(IntegrityError):
            Category.objects.create(name='Technology')
    
    def test_category_str_method(self):
        """__str__メソッドのテスト"""
        category = Category.objects.create(name='Technology')
        self.assertEqual(str(category), 'Technology')


class TagModelTest(TestCase):
    """タグモデルのテスト"""
    
    def test_tag_creation(self):
        """タグの作成テスト"""
        tag = Tag.objects.create(name='Python')
        self.assertEqual(tag.name, 'Python')
        self.assertEqual(tag.slug, 'python')
    
    def test_tag_unique_name(self):
        """タグ名の一意性テスト"""
        Tag.objects.create(name='Python')
        with self.assertRaises(IntegrityError):
            Tag.objects.create(name='Python')
    
    def test_tag_str_method(self):
        """__str__メソッドのテスト"""
        tag = Tag.objects.create(name='Python')
        self.assertEqual(str(tag), 'Python')


class BlogPostModelTest(TestCase):
    """ブログ記事モデルのテスト"""
    
    def setUp(self):
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
    
    def test_blog_post_creation(self):
        """ブログ記事の作成テスト"""
        post = BlogPost.objects.create(
            title='Test Post',
            excerpt='This is a test post',
            content='This is the content of the test post.',
            author=self.author,
            category=self.category,
            status='published'
        )
        post.tags.add(self.tag1, self.tag2)
        
        self.assertEqual(post.title, 'Test Post')
        self.assertEqual(post.slug, 'test-post')
        self.assertEqual(post.author, self.author)
        self.assertEqual(post.category, self.category)
        self.assertEqual(post.tags.count(), 2)
        self.assertTrue(post.is_published)
    
    def test_blog_post_slug_auto_generation(self):
        """スラッグ自動生成のテスト"""
        post = BlogPost.objects.create(
            title='テスト 記事 タイトル',
            excerpt='Test excerpt',
            content='Test content',
            author=self.author
        )
        self.assertTrue(post.slug)  # スラッグが生成されることを確認
    
    def test_blog_post_published_at_auto_set(self):
        """公開日時の自動設定テスト"""
        post = BlogPost.objects.create(
            title='Test Post',
            excerpt='Test excerpt',
            content='Test content',
            author=self.author,
            status='published'
        )
        self.assertIsNotNone(post.published_at)
    
    def test_blog_post_seo_property(self):
        """SEOプロパティのテスト"""
        post = BlogPost.objects.create(
            title='Test Post',
            excerpt='Test excerpt',
            content='Test content',
            author=self.author,
            meta_title='SEO Title',
            meta_description='SEO Description',
            keywords=['test', 'seo'],
            og_image='https://example.com/image.jpg'
        )
        
        seo = post.seo
        self.assertEqual(seo['metaTitle'], 'SEO Title')
        self.assertEqual(seo['metaDescription'], 'SEO Description')
        self.assertEqual(seo['keywords'], ['test', 'seo'])
        self.assertEqual(seo['ogImage'], 'https://example.com/image.jpg')
    
    def test_blog_post_auto_seo_generation(self):
        """SEO自動生成のテスト"""
        post = BlogPost.objects.create(
            title='Test Post Title',
            excerpt='This is a test excerpt for the blog post',
            content='Test content',
            author=self.author
        )
        
        # meta_titleが自動設定されることを確認
        self.assertEqual(post.meta_title, 'Test Post Title')
        # meta_descriptionが自動設定されることを確認
        self.assertEqual(post.meta_description, 'This is a test excerpt for the blog post')
    
    def test_blog_post_str_method(self):
        """__str__メソッドのテスト"""
        post = BlogPost.objects.create(
            title='Test Post',
            excerpt='Test excerpt',
            content='Test content',
            author=self.author
        )
        self.assertEqual(str(post), 'Test Post')
    
    def test_blog_post_get_absolute_url(self):
        """get_absolute_urlメソッドのテスト"""
        post = BlogPost.objects.create(
            title='Test Post',
            excerpt='Test excerpt',
            content='Test content',
            author=self.author
        )
        self.assertEqual(post.get_absolute_url(), '/blog/test-post/')


class CommentModelTest(TestCase):
    """コメントモデルのテスト"""
    
    def setUp(self):
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
            author=self.author
        )
    
    def test_comment_creation(self):
        """コメントの作成テスト"""
        comment = Comment.objects.create(
            post=self.post,
            author='Test Commenter',
            email='commenter@example.com',
            content='This is a test comment.',
            status='pending'
        )
        
        self.assertEqual(comment.post, self.post)
        self.assertEqual(comment.author, 'Test Commenter')
        self.assertEqual(comment.email, 'commenter@example.com')
        self.assertEqual(comment.content, 'This is a test comment.')
        self.assertEqual(comment.status, 'pending')
        self.assertFalse(comment.is_approved)
    
    def test_comment_post_id_property(self):
        """post_idプロパティのテスト"""
        comment = Comment.objects.create(
            post=self.post,
            author='Test Commenter',
            email='commenter@example.com',
            content='This is a test comment.'
        )
        self.assertEqual(comment.post_id, str(self.post.id))
    
    def test_comment_approval_status(self):
        """承認状態のテスト"""
        comment = Comment.objects.create(
            post=self.post,
            author='Test Commenter',
            email='commenter@example.com',
            content='This is a test comment.',
            status='approved'
        )
        self.assertTrue(comment.is_approved)
    
    def test_comment_str_method(self):
        """__str__メソッドのテスト"""
        comment = Comment.objects.create(
            post=self.post,
            author='Test Commenter',
            email='commenter@example.com',
            content='This is a test comment.'
        )
        expected_str = f'Test Commenter - {self.post.title[:30]}...'
        self.assertEqual(str(comment), expected_str)


class SocialLinkModelTest(TestCase):
    """ソーシャルリンクモデルのテスト"""
    
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        self.author = Author.objects.create(
            user=self.user,
            display_name='Test Author'
        )
    
    def test_social_link_creation(self):
        """ソーシャルリンクの作成テスト"""
        social_link = SocialLink.objects.create(
            author=self.author,
            platform='Twitter',
            url='https://twitter.com/testuser',
            icon='twitter'
        )
        
        self.assertEqual(social_link.author, self.author)
        self.assertEqual(social_link.platform, 'Twitter')
        self.assertEqual(social_link.url, 'https://twitter.com/testuser')
        self.assertEqual(social_link.icon, 'twitter')
    
    def test_social_link_unique_constraint(self):
        """ユニーク制約のテスト"""
        SocialLink.objects.create(
            author=self.author,
            platform='Twitter',
            url='https://twitter.com/testuser'
        )
        
        with self.assertRaises(IntegrityError):
            SocialLink.objects.create(
                author=self.author,
                platform='Twitter',
                url='https://twitter.com/another'
            )
    
    def test_social_link_str_method(self):
        """__str__メソッドのテスト"""
        social_link = SocialLink.objects.create(
            author=self.author,
            platform='Twitter',
            url='https://twitter.com/testuser'
        )
        expected_str = f'{self.author.display_name} - Twitter'
        self.assertEqual(str(social_link), expected_str)