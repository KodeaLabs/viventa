"""
Test settings for Venezuelan Real Estate Platform.
Uses SQLite for faster testing without requiring a database server.
"""

from .settings import *  # noqa

# Use SQLite for testing (file-based for development server persistence)
import os
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": os.path.join(os.path.dirname(os.path.dirname(__file__)), "db_test.sqlite3"),
    }
}

# Use dummy cache for testing
CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.dummy.DummyCache",
    }
}

# Disable password validators for faster testing
AUTH_PASSWORD_VALIDATORS = []

# Disable throttling for tests
REST_FRAMEWORK["DEFAULT_THROTTLE_CLASSES"] = []
REST_FRAMEWORK["DEFAULT_THROTTLE_RATES"] = {}

# Use session auth for tests
REST_FRAMEWORK["DEFAULT_AUTHENTICATION_CLASSES"] = [
    "rest_framework.authentication.SessionAuthentication",
]

# Faster password hashing for tests
PASSWORD_HASHERS = [
    "django.contrib.auth.hashers.MD5PasswordHasher",
]
