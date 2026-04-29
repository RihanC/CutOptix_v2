from .base import *

# Production settings
DEBUG = False

ALLOWED_HOSTS = config('ALLOWED_HOSTS', default='yourdomain.com', cast=Csv())

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': config('DATABASE_NAME', default='cutoptix'),
        'USER': config('DATABASE_USER', default='cutoptix_user'),
        'PASSWORD': config('DATABASE_PASSWORD'),
        'HOST': config('DATABASE_HOST', default='localhost'),
        'PORT': config('DATABASE_PORT', default='5432'),
    }
}

# Security settings
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_SECURITY_POLICY = {
    "default-src": ("'self'",),
    "script-src": ("'self'", "cdn.jsdelivr.net"),
    "style-src": ("'self'", "cdn.jsdelivr.net"),
}

# HSTS
SECURE_HSTS_SECONDS = 31536000  # 1 year
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True

# Use real email backend
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'

# Production CORS settings
CORS_ALLOWED_ORIGINS = config('CORS_ALLOWED_ORIGINS', cast=Csv())
CORS_ALLOW_CREDENTIALS = False

# Static files
STATIC_URL = '/static/'
STATIC_ROOT = '/var/www/cutoptix/staticfiles'
COMPRESS_OFFLINE = True

# Logging level
LOGGING['loggers']['django']['level'] = 'WARNING'
