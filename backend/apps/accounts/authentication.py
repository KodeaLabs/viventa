"""
Auth0 JWT Authentication for Django REST Framework.
"""

import json
import logging
from typing import Tuple

import jwt
from django.conf import settings
from jwt import PyJWKClient
from rest_framework import authentication, exceptions

from .models import User

logger = logging.getLogger(__name__)


class Auth0JWTAuthentication(authentication.BaseAuthentication):
    """
    Custom authentication class for Auth0 JWT tokens.
    """

    def authenticate(self, request) -> Tuple[User, dict] | None:
        auth_header = request.META.get("HTTP_AUTHORIZATION", "")

        if not auth_header.startswith("Bearer "):
            return None

        token = auth_header.split(" ")[1]

        try:
            payload = self._decode_token(token)
            user = self._get_or_create_user(payload)
            return (user, payload)
        except jwt.ExpiredSignatureError:
            raise exceptions.AuthenticationFailed("Token has expired")
        except jwt.InvalidTokenError as e:
            logger.warning(f"Invalid token: {e}")
            raise exceptions.AuthenticationFailed("Invalid token")
        except Exception as e:
            logger.error(f"Authentication error: {e}")
            raise exceptions.AuthenticationFailed("Authentication failed")

    def _decode_token(self, token: str) -> dict:
        """
        Decode and verify the JWT token using Auth0's JWKS.
        """
        jwks_url = f"https://{settings.AUTH0_DOMAIN}/.well-known/jwks.json"
        jwks_client = PyJWKClient(jwks_url)

        try:
            signing_key = jwks_client.get_signing_key_from_jwt(token)
        except Exception as e:
            logger.error(f"Failed to get signing key: {e}")
            raise jwt.InvalidTokenError("Failed to get signing key")

        payload = jwt.decode(
            token,
            signing_key.key,
            algorithms=settings.AUTH0_ALGORITHMS,
            audience=settings.AUTH0_API_IDENTIFIER,
            issuer=f"https://{settings.AUTH0_DOMAIN}/",
        )

        return payload

    def _get_or_create_user(self, payload: dict) -> User:
        """
        Get or create a user based on Auth0 token payload.
        """
        auth0_id = payload.get("sub")
        email = payload.get("email") or payload.get(f"{settings.AUTH0_API_IDENTIFIER}/email")

        if not auth0_id:
            raise exceptions.AuthenticationFailed("No user ID in token")

        # Try to find user by auth0_id first
        user = User.objects.filter(auth0_id=auth0_id).first()

        if user:
            # Update user info if changed
            self._update_user_from_payload(user, payload)
            return user

        # Try to find by email and link
        if email:
            user = User.objects.filter(email=email).first()
            if user:
                user.auth0_id = auth0_id
                self._update_user_from_payload(user, payload)
                return user

        # Create new user
        if not email:
            email = f"{auth0_id}@auth0.user"

        user = User.objects.create(
            email=email,
            auth0_id=auth0_id,
            is_active=True,
        )
        self._update_user_from_payload(user, payload)

        return user

    def _update_user_from_payload(self, user: User, payload: dict) -> None:
        """
        Update user fields from Auth0 payload.
        """
        changed = False

        # Get user metadata from token
        name = payload.get("name", "")
        if name and not user.first_name:
            parts = name.split(" ", 1)
            user.first_name = parts[0]
            if len(parts) > 1:
                user.last_name = parts[1]
            changed = True

        picture = payload.get("picture")
        # Note: We don't auto-update avatar URL to avoid storage issues

        email = payload.get("email")
        if email and email != user.email:
            # Only update if user email was placeholder
            if "@auth0.user" in user.email:
                user.email = email
                changed = True

        if changed:
            user.save()
