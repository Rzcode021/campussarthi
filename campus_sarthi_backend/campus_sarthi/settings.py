import os
from pathlib import Path
from datetime import timedelta
from dotenv import load_dotenv
from django.core.exceptions import ImproperlyConfigured
from psycopg import ProgrammingError
from psycopg.conninfo import conninfo_to_dict

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / '.env')

SECRET_KEY = os.getenv('SECRET_KEY', 'fallback-secret-key-for-dev-only')
DEBUG = os.getenv('DEBUG', 'True') == 'True'
def _csv_env(name: str, default: str) -> list[str]:
    return [item.strip() for item in os.getenv(name, default).split(',') if item.strip()]


ALLOWED_HOSTS = ['*'] if DEBUG else _csv_env('ALLOWED_HOSTS', 'localhost,127.0.0.1')

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'cloudinary_storage',
    'django.contrib.staticfiles',
    'cloudinary',
    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',
    'accounts',
    'companies',
    'crew',
    'resources',
    'news',
    'bookmarks',
    'study_materials',
    'events',
]

import cloudinary

CLOUDINARY_CLOUD_NAME = os.getenv('CLOUDINARY_CLOUD_NAME')

CLOUDINARY_STORAGE = {
    'CLOUD_NAME': CLOUDINARY_CLOUD_NAME,
    'API_KEY': os.getenv('CLOUDINARY_API_KEY'),
    'API_SECRET': os.getenv('CLOUDINARY_API_SECRET'),
    'SECURE': True,
}

cloudinary.config(
    cloud_name=CLOUDINARY_CLOUD_NAME,
    api_key=os.getenv('CLOUDINARY_API_KEY'),
    api_secret=os.getenv('CLOUDINARY_API_SECRET'),
    secure=True
)

if CLOUDINARY_CLOUD_NAME and CLOUDINARY_CLOUD_NAME != 'demo_cloud':
    DEFAULT_FILE_STORAGE = 'cloudinary_storage.storage.MediaCloudinaryStorage'
else:
    # Use local storage if no valid Cloudinary credentials are provided
    DEFAULT_FILE_STORAGE = 'django.core.files.storage.FileSystemStorage'

import os
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')



MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'campus_sarthi.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'campus_sarthi.wsgi.application'

_database_url = os.getenv('DATABASE_URL')
if not _database_url:
    raise ImproperlyConfigured('DATABASE_URL must be set to the Neon PostgreSQL URL.')
try:
    _database_options = conninfo_to_dict(_database_url)
except ProgrammingError:
    raise ImproperlyConfigured('DATABASE_URL is not a valid PostgreSQL connection string.') from None

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': _database_options.pop('dbname', ''),
        'USER': _database_options.pop('user', ''),
        'PASSWORD': _database_options.pop('password', ''),
        'HOST': _database_options.pop('host', ''),
        'PORT': _database_options.pop('port', '5432'),
        'OPTIONS': _database_options,
        # Neon uses transaction pooling; cursors must not outlive a transaction.
        'DISABLE_SERVER_SIDE_CURSORS': True,
    }
}

AUTH_PASSWORD_VALIDATORS = []

AUTH_USER_MODEL = 'accounts.CustomUser'

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'Asia/Kolkata'
USE_I18N = True
USE_TZ = True

STATIC_URL = 'static/'

MEDIA_URL = '/media/'
# Actual files are served from Cloudinary CDN, not from local /media/ folder anymore.


FILE_UPLOAD_MAX_MEMORY_SIZE = 10 * 1024 * 1024  # 10MB

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
}

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=2),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'TOKEN_OBTAIN_SERIALIZER': 'accounts.serializers.CustomTokenObtainPairSerializer',
}

_default_cors_origins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'http://localhost:5176',
    'http://localhost:5177',
    'http://localhost:5178',
    'http://localhost:5179',
    'http://localhost:5180',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174',
    'http://127.0.0.1:5175',
]

CORS_ALLOWED_ORIGINS = _csv_env('CORS_ALLOWED_ORIGINS', ','.join(_default_cors_origins))
CORS_ALLOWED_ORIGIN_REGEXES = [r'^https://.*\.vercel\.app$']
CORS_ALLOW_CREDENTIALS = True
