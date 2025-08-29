import os
from pathlib import Path
from datetime import timedelta
import yaml

BASE_DIR = Path(__file__).resolve().parent.parent

with open(os.path.join(BASE_DIR,'config.yaml'), 'r') as f:
    CONFIG = yaml.load(f, Loader = yaml.SafeLoader)

SECRET_KEY = CONFIG['SECRET_KEY']
DEBUG = CONFIG['DEBUG']

if DEBUG:
    ALLOWED_HOSTS = ['*']
else:
    ALLOWED_HOSTS = CONFIG['ALLOWED_HOSTS']

HOST = CONFIG['HOST']

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'corsheaders',
    'accounts',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'social_api.urls'

TEMPLATES = [
    { 
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
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

WSGI_APPLICATION = 'social_api.wsgi.application'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': CONFIG['PGDATABASE'],
        'USER': CONFIG['PGUSER'],
        'PASSWORD': CONFIG['PGPASSWORD'],
        'HOST': CONFIG['PGHOST'],
        'PORT': CONFIG['PGPORT'],
        'OPTIONS': {
            'sslmode': CONFIG['PGSSLMODE'],
        },
        'DISABLE_SERVER_SIDE_CURSORS': True,
    }
}

AUTH_USER_MODEL = 'accounts.User'

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.AllowAny',
    ),
}

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=int(CONFIG['ACCESS_TOKEN_LIFETIME'])),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=int(CONFIG['REFRESH_TOKEN_LIFETIME'])),
    'SIGNING_KEY': SECRET_KEY,
}

LANGUAGE_CODE='en-us'

TIME_ZONE='Asia/Calcutta'

USE_I18N=True

USE_TZ=True

STATIC_URL='static/'

DEFAULT_AUTO_FIELD='django.db.models.BigAutoField'

if DEBUG:
    CORS_ALLOW_ALL_ORIGINS = True
    CORS_ALLOW_CREDENTIALS = True
else:
    CORS_ALLOWED_ORIGINS = config['CORS_ALLOWED_ORIGINS']

# Email
EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST = CONFIG['EMAIL_HOST']
EMAIL_HOST_USER = CONFIG['EMAIL_HOST_USER']
EMAIL_HOST_PASSWORD = CONFIG['EMAIL_HOST_PASSWORD']
EMAIL_PORT = CONFIG['EMAIL_PORT']
EMAIL_USE_TLS = CONFIG['EMAIL_USE_TLS']
SERVER_EMAIL = CONFIG['SERVER_EMAIL']
DEFAULT_FROM_EMAIL = CONFIG['DEFAULT_FROM_EMAIL']

# OAuth settings
OAUTH_REDIRECT_URI = CONFIG['OAUTH_REDIRECT_URI']

GOOGLE_CLIENT_ID = CONFIG['GOOGLE_CLIENT_ID']
GOOGLE_CLIENT_SECRET = CONFIG['GOOGLE_CLIENT_SECRET']

GITHUB_CLIENT_ID = CONFIG['GITHUB_CLIENT_ID']
GITHUB_CLIENT_SECRET = CONFIG['GITHUB_CLIENT_SECRET']

FACEBOOK_CLIENT_ID = CONFIG['FACEBOOK_CLIENT_ID']
FACEBOOK_CLIENT_SECRET = CONFIG['FACEBOOK_CLIENT_SECRET']

LINKEDIN_CLIENT_ID = CONFIG['LINKEDIN_CLIENT_ID']
LINKEDIN_CLIENT_SECRET = CONFIG['LINKEDIN_CLIENT_SECRET']

ADMINS = [tuple(admin) for admin in CONFIG['ADMINS']]