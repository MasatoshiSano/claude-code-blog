from rest_framework.throttling import UserRateThrottle, AnonRateThrottle
from django.core.cache import cache


class LoginRateThrottle(AnonRateThrottle):
    """ログイン試行回数制限"""
    scope = 'login'


class RegisterRateThrottle(AnonRateThrottle):
    """ユーザー登録回数制限"""
    scope = 'register'


class CommentRateThrottle(UserRateThrottle):
    """コメント投稿回数制限"""
    scope = 'comment'
    
    def allow_request(self, request, view):
        """コメント投稿の特別な制限"""
        if request.method == 'POST':
            return super().allow_request(request, view)
        return True


class SearchRateThrottle(AnonRateThrottle):
    """検索API回数制限"""
    scope = 'search'


class CustomUserRateThrottle(UserRateThrottle):
    """カスタムユーザーレート制限"""
    
    def get_cache_key(self, request, view):
        """ユーザーIDとIPアドレスベースのキャッシュキー"""
        if request.user and request.user.is_authenticated:
            ident = request.user.pk
        else:
            ident = self.get_ident(request)
        
        return self.cache_format % {
            'scope': self.scope,
            'ident': ident
        }


class BurstRateThrottle(AnonRateThrottle):
    """短時間での大量アクセス制限"""
    scope = 'burst'
    
    def parse_rate(self, rate):
        """レート設定をパース（10/min形式）"""
        if rate is None:
            return (None, None)
        num, period = rate.split('/')
        num_requests = int(num)
        duration = {'s': 1, 'm': 60, 'h': 3600, 'd': 86400}[period[0]]
        return (num_requests, duration)


class SustainedRateThrottle(AnonRateThrottle):
    """持続的なアクセス制限"""
    scope = 'sustained'
    
    def parse_rate(self, rate):
        """レート設定をパース（1000/day形式）"""
        if rate is None:
            return (None, None)
        num, period = rate.split('/')
        num_requests = int(num)
        duration = {'s': 1, 'm': 60, 'h': 3600, 'd': 86400}[period[0]]
        return (num_requests, duration)


class AdminRateThrottle(UserRateThrottle):
    """管理者用の緩いレート制限"""
    
    def allow_request(self, request, view):
        """管理者は制限を適用しない"""
        if request.user and request.user.is_authenticated and request.user.is_staff:
            return True
        return super().allow_request(request, view)