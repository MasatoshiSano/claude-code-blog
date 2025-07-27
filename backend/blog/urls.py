from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'posts', views.BlogPostViewSet, basename='blogpost')
router.register(r'categories', views.CategoryViewSet, basename='category')
router.register(r'tags', views.TagViewSet, basename='tag')
router.register(r'authors', views.AuthorViewSet, basename='author')
router.register(r'comments', views.CommentViewSet, basename='comment')

urlpatterns = [
    path('', include(router.urls)),
    path('posts/<slug:slug>/', views.BlogPostDetailView.as_view(), name='post-detail'),
    path('search/', views.SearchAPIView.as_view(), name='search'),
]