"""
Common utility functions.
"""

import re
from decimal import Decimal
from typing import Any

from django.core.cache import cache
from slugify import slugify


def generate_unique_slug(model_class, value: str, slug_field: str = "slug") -> str:
    """
    Generate a unique slug for a model instance.
    """
    base_slug = slugify(value)
    slug = base_slug
    counter = 1

    while model_class.objects.filter(**{slug_field: slug}).exists():
        slug = f"{base_slug}-{counter}"
        counter += 1

    return slug


def format_price_usd(amount: Decimal) -> str:
    """
    Format a decimal amount as USD currency.
    """
    return f"${amount:,.2f}"


def cache_result(key: str, timeout: int = 300):
    """
    Decorator to cache function results.
    """

    def decorator(func):
        def wrapper(*args, **kwargs):
            cache_key = f"{key}:{hash(str(args) + str(kwargs))}"
            result = cache.get(cache_key)
            if result is None:
                result = func(*args, **kwargs)
                cache.set(cache_key, result, timeout)
            return result

        return wrapper

    return decorator


def invalidate_cache_pattern(pattern: str) -> None:
    """
    Invalidate all cache keys matching a pattern.
    """
    cache.delete_pattern(f"{pattern}*")


def clean_phone_number(phone: str) -> str:
    """
    Clean and normalize a phone number.
    """
    return re.sub(r"[^\d+]", "", phone)


def truncate_text(text: str, max_length: int = 100) -> str:
    """
    Truncate text to a maximum length with ellipsis.
    """
    if len(text) <= max_length:
        return text
    return text[: max_length - 3] + "..."
