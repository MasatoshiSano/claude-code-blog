"""
Test settings for blog_project.
"""

from .base import *

# テスト環境では高速化のためSQLiteを使用
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': ':memory:',
    }
}

# テスト用のキャッシュ設定
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
    }
}

# パスワードハッシュ化を高速化
PASSWORD_HASHERS = [
    'django.contrib.auth.hashers.MD5PasswordHasher',
]

# メール送信を無効化
EMAIL_BACKEND = 'django.core.mail.backends.locmem.EmailBackend'

# セッション設定
SESSION_ENGINE = 'django.contrib.sessions.backends.cache'

# ログ設定を簡素化
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['console'],
            'level': 'WARNING',
        },
    },
}

# テスト用のセキュリティ設定
SECRET_KEY = 'test-secret-key-for-testing-only'

# テスト用のレート制限設定（より緩い設定）
REST_FRAMEWORK['DEFAULT_THROTTLE_RATES'] = {
    'anon': '1000/hour',
    'user': '2000/hour',
    'login': '100/min',
    'register': '50/min',
    'comment': '100/hour',
    'search': '200/hour',
}

# テスト用のJWT設定
SIMPLE_JWT.update({
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=5),
    'REFRESH_TOKEN_LIFETIME': timedelta(hours=1),
})

# ファイルアップロードをメモリで処理
FILE_UPLOAD_HANDLERS = [
    'django.core.files.uploadhandler.MemoryFileUploadHandler',
]

# 静的ファイル設定
STATICFILES_STORAGE = 'django.contrib.staticfiles.storage.StaticFilesStorage'

# テスト用のCORS設定
CORS_ALLOW_ALL_ORIGINS = True