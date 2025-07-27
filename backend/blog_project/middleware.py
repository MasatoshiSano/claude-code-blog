import time
import logging
from django.utils.deprecation import MiddlewareMixin
from django.http import HttpResponse
from django.core.cache import cache
from django.conf import settings

logger = logging.getLogger(__name__)


class SecurityHeadersMiddleware:
    """セキュリティヘッダーを追加するミドルウェア"""
    
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        
        # セキュリティヘッダーを追加
        response['X-Content-Type-Options'] = 'nosniff'
        response['X-Frame-Options'] = 'DENY'
        response['X-XSS-Protection'] = '1; mode=block'
        response['Referrer-Policy'] = 'strict-origin-when-cross-origin'
        response['Permissions-Policy'] = 'geolocation=(), microphone=(), camera=()'
        
        # HTTPS関連ヘッダー（本番環境）
        if request.is_secure():
            response['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains; preload'
        
        return response


class RequestLoggingMiddleware:
    """リクエストログを記録するミドルウェア"""
    
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        start_time = time.time()
        
        # リクエスト情報をログに記録
        logger.info(f"Request: {request.method} {request.path} from {self.get_client_ip(request)}")
        
        response = self.get_response(request)
        
        # レスポンス時間を記録
        duration = time.time() - start_time
        logger.info(f"Response: {response.status_code} in {duration:.3f}s")
        
        return response
    
    def get_client_ip(self, request):
        """クライアントIPアドレスを取得"""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip


class RateLimitMiddleware:
    """シンプルなレート制限ミドルウェア"""
    
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # レート制限を適用するパス
        rate_limited_paths = [
            '/api/auth/login/',
            '/api/auth/registration/',
            '/api/blog/comments/',
        ]
        
        if any(request.path.startswith(path) for path in rate_limited_paths):
            if not self.is_allowed(request):
                response = HttpResponse("Rate limit exceeded", status=429)
                return response
        
        response = self.get_response(request)
        return response
    
    def is_allowed(self, request):
        """レート制限チェック"""
        client_ip = self.get_client_ip(request)
        cache_key = f"rate_limit_{client_ip}_{request.path}"
        
        current_requests = cache.get(cache_key, 0)
        if current_requests >= 10:  # 10回/分の制限
            return False
        
        cache.set(cache_key, current_requests + 1, 60)  # 1分間キャッシュ
        return True
    
    def get_client_ip(self, request):
        """クライアントIPアドレスを取得"""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip


class ContentValidationMiddleware:
    """コンテンツ検証ミドルウェア"""
    
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # POSTリクエストのサイズ制限
        if request.method == 'POST':
            content_length = request.META.get('CONTENT_LENGTH')
            if content_length and int(content_length) > 5 * 1024 * 1024:  # 5MB制限
                from django.http import HttpResponseBadRequest
                return HttpResponseBadRequest("Request too large")
        
        response = self.get_response(request)
        return response