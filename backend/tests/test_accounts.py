"""
Tests for the accounts app.
"""

import pytest
from django.urls import reverse

from apps.accounts.models import User


@pytest.mark.django_db
class TestUserModel:
    """Tests for User model."""

    def test_create_user(self, create_user):
        """Test creating a regular user."""
        user = create_user(email="test@test.com")
        assert user.email == "test@test.com"
        assert user.role == "buyer"
        assert not user.is_staff
        assert not user.is_superuser

    def test_create_agent(self, create_user):
        """Test creating an agent user."""
        user = create_user(email="agent@test.com", role="agent")
        assert user.email == "agent@test.com"
        assert user.role == "agent"
        assert user.is_agent

    def test_user_full_name(self, create_user):
        """Test user full name property."""
        user = create_user(
            email="test@test.com", first_name="John", last_name="Doe"
        )
        assert user.full_name == "John Doe"

    def test_user_full_name_fallback(self, create_user):
        """Test user full name falls back to email."""
        user = create_user(email="test@test.com")
        assert user.full_name == "test@test.com"


@pytest.mark.django_db
class TestCurrentUserView:
    """Tests for CurrentUserView."""

    def test_get_current_user_authenticated(self, authenticated_client, buyer_user):
        """Test getting current user when authenticated."""
        url = reverse("current-user")
        response = authenticated_client.get(url)

        assert response.status_code == 200
        assert response.data["success"] is True
        assert response.data["data"]["email"] == buyer_user.email

    def test_get_current_user_unauthenticated(self, api_client):
        """Test getting current user when not authenticated."""
        url = reverse("current-user")
        response = api_client.get(url)

        # SessionAuthentication returns 403, JWT returns 401
        assert response.status_code in [401, 403]


@pytest.mark.django_db
class TestBecomeAgentView:
    """Tests for BecomeAgentView."""

    def test_become_agent_success(self, authenticated_client, buyer_user):
        """Test becoming an agent."""
        url = reverse("become-agent")
        response = authenticated_client.post(url)

        assert response.status_code == 200
        assert response.data["success"] is True

        buyer_user.refresh_from_db()
        assert buyer_user.role == "agent"

    def test_become_agent_already_agent(self, agent_client, agent_user):
        """Test becoming agent when already an agent."""
        url = reverse("become-agent")
        response = agent_client.post(url)

        assert response.status_code == 400


@pytest.mark.django_db
class TestHealthCheck:
    """Tests for health check endpoint."""

    def test_health_check(self, api_client):
        """Test health check endpoint."""
        url = reverse("health-check")
        response = api_client.get(url)

        assert response.status_code == 200
        assert response.data["status"] == "healthy"
