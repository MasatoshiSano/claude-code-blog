from django.urls import path, include
from rest_framework_simplejwt.views import TokenVerifyView
from . import views

app_name = 'authentication'

urlpatterns = [
    # JWT認証
    path('jwt/token/', views.CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('jwt/token/refresh/', views.CustomTokenRefreshView.as_view(), name='token_refresh'),
    path('jwt/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('jwt/logout/', views.logout_view, name='jwt_logout'),
    
    # dj-rest-auth endpoints
    path('', include('dj_rest_auth.urls')),
    path('registration/', include('dj_rest_auth.registration.urls')),
    
    # django-allauth (for social auth)
    path('allauth/', include('allauth.urls')),
    
    # カスタムエンドポイント
    path('profile/', views.user_profile_view, name='user_profile'),
    path('profile/update/', views.update_profile_view, name='update_profile'),
    path('status/', views.auth_status_view, name='auth_status'),
    path('change-password/', views.change_password_view, name='change_password'),
    path('users/<str:username>/', views.UserDetailView.as_view(), name='user_detail'),
]