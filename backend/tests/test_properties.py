"""
Tests for the properties app.
"""

from decimal import Decimal

import pytest
from django.urls import reverse

from apps.properties.models import Property, PropertyImage, PropertyStatus


@pytest.fixture
def sample_property(agent_user):
    """Create a sample property for testing."""
    return Property.objects.create(
        title="Beautiful Beach House",
        description="A stunning beachfront property in Margarita Island.",
        property_type="house",
        listing_type="sale",
        status=PropertyStatus.ACTIVE,
        price=Decimal("150000.00"),
        bedrooms=4,
        bathrooms=Decimal("3.5"),
        area_sqm=Decimal("250.00"),
        address="123 Beach Road",
        city="Porlamar",
        state="Nueva Esparta",
        country="Venezuela",
        agent=agent_user,
        is_beachfront=True,
    )


@pytest.fixture
def draft_property(agent_user):
    """Create a draft property for testing."""
    return Property.objects.create(
        title="Draft Property",
        description="A draft property.",
        property_type="apartment",
        listing_type="sale",
        status=PropertyStatus.DRAFT,
        price=Decimal("50000.00"),
        bedrooms=2,
        bathrooms=Decimal("1.0"),
        address="456 Draft Street",
        city="Caracas",
        state="Distrito Capital",
        agent=agent_user,
    )


@pytest.mark.django_db
class TestPropertyModel:
    """Tests for Property model."""

    def test_create_property(self, sample_property):
        """Test creating a property."""
        assert sample_property.title == "Beautiful Beach House"
        assert sample_property.price == Decimal("150000.00")
        assert sample_property.slug is not None

    def test_property_location_display(self, sample_property):
        """Test property location display."""
        assert sample_property.location_display == "Porlamar, Nueva Esparta"

    def test_property_slug_generation(self, agent_user):
        """Test slug is auto-generated."""
        prop = Property.objects.create(
            title="Test Property",
            description="Test",
            price=Decimal("100000.00"),
            address="Test",
            city="Test",
            state="Test",
            agent=agent_user,
        )
        assert prop.slug == "test-property"


@pytest.mark.django_db
class TestPublicPropertyViewSet:
    """Tests for PublicPropertyViewSet."""

    def test_list_properties(self, api_client, sample_property):
        """Test listing public properties."""
        url = reverse("public-properties-list")
        response = api_client.get(url)

        assert response.status_code == 200
        assert response.data["success"] is True
        assert len(response.data["data"]) == 1

    def test_list_excludes_drafts(self, api_client, sample_property, draft_property):
        """Test that draft properties are not listed."""
        url = reverse("public-properties-list")
        response = api_client.get(url)

        assert response.status_code == 200
        assert len(response.data["data"]) == 1
        assert response.data["data"][0]["title"] == "Beautiful Beach House"

    def test_retrieve_property(self, api_client, sample_property):
        """Test retrieving a single property."""
        url = reverse("public-properties-detail", args=[sample_property.slug])
        response = api_client.get(url)

        assert response.status_code == 200
        assert response.data["success"] is True
        assert response.data["data"]["title"] == "Beautiful Beach House"

    def test_filter_by_city(self, api_client, sample_property):
        """Test filtering properties by city."""
        url = reverse("public-properties-list")
        response = api_client.get(url, {"city": "Porlamar"})

        assert response.status_code == 200
        assert len(response.data["data"]) == 1

    def test_filter_by_price_range(self, api_client, sample_property):
        """Test filtering properties by price range."""
        url = reverse("public-properties-list")
        response = api_client.get(url, {"min_price": 100000, "max_price": 200000})

        assert response.status_code == 200
        assert len(response.data["data"]) == 1

    def test_featured_properties(self, api_client, sample_property):
        """Test getting featured properties."""
        sample_property.is_featured = True
        sample_property.save()

        url = reverse("public-properties-featured")
        response = api_client.get(url)

        assert response.status_code == 200
        assert response.data["success"] is True


@pytest.mark.django_db
class TestAgentPropertyViewSet:
    """Tests for AgentPropertyViewSet."""

    def test_list_agent_properties(self, agent_client, sample_property):
        """Test agent listing their own properties."""
        url = reverse("agent-properties-list")
        response = agent_client.get(url)

        assert response.status_code == 200
        assert len(response.data["data"]) == 1

    def test_create_property(self, agent_client):
        """Test agent creating a property."""
        url = reverse("agent-properties-list")
        data = {
            "title": "New Property",
            "description": "A new property listing.",
            "property_type": "apartment",
            "listing_type": "sale",
            "price": "75000.00",
            "bedrooms": 2,
            "bathrooms": "1.0",
            "address": "789 New Street",
            "city": "Valencia",
            "state": "Carabobo",
        }
        response = agent_client.post(url, data)

        assert response.status_code == 201
        assert response.data["success"] is True
        assert response.data["data"]["title"] == "New Property"

    def test_update_property(self, agent_client, sample_property):
        """Test agent updating their property."""
        url = reverse("agent-properties-detail", args=[sample_property.id])
        response = agent_client.patch(url, {"price": "160000.00"})

        assert response.status_code == 200
        sample_property.refresh_from_db()
        assert sample_property.price == Decimal("160000.00")

    def test_delete_property(self, agent_client, sample_property):
        """Test agent deleting their property."""
        url = reverse("agent-properties-detail", args=[sample_property.id])
        response = agent_client.delete(url)

        assert response.status_code == 204
        assert not Property.objects.filter(id=sample_property.id).exists()

    def test_buyer_cannot_create_property(self, authenticated_client):
        """Test that buyers cannot create properties."""
        url = reverse("agent-properties-list")
        data = {
            "title": "Test",
            "description": "Test",
            "price": "50000.00",
            "address": "Test",
            "city": "Test",
            "state": "Test",
        }
        response = authenticated_client.post(url, data)

        assert response.status_code == 403
