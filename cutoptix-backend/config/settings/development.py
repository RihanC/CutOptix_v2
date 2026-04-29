from .base import *

# Development settings
DEBUG = True
ALLOWED_HOSTS = ['localhost', '127.0.0.1', '*']

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'cutoptix_dev',
        'USER': 'cutoptix_user',
        'PASSWORD': 'password',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}

# Use console email backend for development
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

# Disable CSRF for development
CSRF_TRUSTED_ORIGINS = ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174', 'http://127.0.0.1:5174']

# Development CORS settings
CORS_ALLOWED_ORIGINS = [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5173',
    'http://localhost:5174',
    'http://127.0.0.1:5174',
]
CORS_ALLOW_CREDENTIALS = True

# Development logging
LOGGING['loggers']['django']['level'] = 'DEBUG'

# Install django-extensions for development
if 'django_extensions' not in INSTALLED_APPS:
    INSTALLED_APPS += ['django_extensions']
