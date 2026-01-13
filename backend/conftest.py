"""
Pytest configuration and fixtures.
"""

import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient

User = get_user_model()


@pytest.fixture
def api_client():
    """Return an API client instance."""
    return APIClient()


@pytest.fixture
def create_user(db):
    """Factory fixture to create users."""

    def _create_user(
        email="test@example.com",
        password="testpass123",
        role="buyer",
        **kwargs,
    ):
        user = User.objects.create_user(
            email=email,
            password=password,
            role=role,
            **kwargs,
        )
        return user

    return _create_user


@pytest.fixture
def buyer_user(create_user):
    """Create a buyer user."""
    return create_user(email="buyer@example.com", role="buyer")


@pytest.fixture
def agent_user(create_user):
    """Create an agent user."""
    return create_user(
        email="agent@example.com",
        role="agent",
        first_name="Test",
        last_name="Agent",
        is_verified_agent=True,
    )


@pytest.fixture
def admin_user(create_user):
    """Create an admin user."""
    return create_user(
        email="admin@example.com",
        role="admin",
        is_staff=True,
        is_superuser=True,
    )


@pytest.fixture
def authenticated_client(api_client, buyer_user):
    """Return an authenticated API client."""
    api_client.force_authenticate(user=buyer_user)
    return api_client


@pytest.fixture
def agent_client(api_client, agent_user):
    """Return an API client authenticated as agent."""
    api_client.force_authenticate(user=agent_user)
    return api_client


@pytest.fixture
def admin_client(api_client, admin_user):
    """Return an API client authenticated as admin."""
    api_client.force_authenticate(user=admin_user)
    return api_client
