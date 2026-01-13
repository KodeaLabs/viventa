"""
Tests for the inquiries app.
"""

from decimal import Decimal

import pytest
from django.urls import reverse

from apps.inquiries.models import Inquiry, InquiryStatus
from apps.properties.models import Property, PropertyStatus


@pytest.fixture
def active_property(agent_user):
    """Create an active property for testing."""
    return Property.objects.create(
        title="Test Property",
        description="A test property.",
        property_type="house",
        listing_type="sale",
        status=PropertyStatus.ACTIVE,
        price=Decimal("100000.00"),
        bedrooms=3,
        bathrooms=Decimal("2.0"),
        address="123 Test Street",
        city="Porlamar",
        state="Nueva Esparta",
        agent=agent_user,
    )


@pytest.fixture
def sample_inquiry(active_property):
    """Create a sample inquiry for testing."""
    return Inquiry.objects.create(
        property_listing=active_property,
        full_name="John Doe",
        email="john@example.com",
        phone="+1234567890",
        country="United States",
        message="I am interested in this property.",
        preferred_contact_method="email",
        preferred_language="en",
    )


@pytest.mark.django_db
class TestInquiryModel:
    """Tests for Inquiry model."""

    def test_create_inquiry(self, sample_inquiry):
        """Test creating an inquiry."""
        assert sample_inquiry.full_name == "John Doe"
        assert sample_inquiry.status == InquiryStatus.NEW
        assert sample_inquiry.agent == sample_inquiry.property_listing.agent


@pytest.mark.django_db
class TestPublicInquiryView:
    """Tests for public inquiry creation."""

    def test_create_inquiry(self, api_client, active_property):
        """Test creating an inquiry as public user."""
        url = reverse("create-inquiry")
        data = {
            "property": str(active_property.id),
            "full_name": "Jane Doe",
            "email": "jane@example.com",
            "phone": "+1987654321",
            "country": "Canada",
            "message": "I would like to schedule a viewing.",
            "preferred_contact_method": "whatsapp",
            "preferred_language": "es",
        }
        response = api_client.post(url, data)

        assert response.status_code == 201
        assert response.data["success"] is True
        assert Inquiry.objects.filter(email="jane@example.com").exists()

    def test_create_inquiry_inactive_property(self, api_client, agent_user):
        """Test cannot create inquiry for inactive property."""
        inactive_property = Property.objects.create(
            title="Inactive Property",
            description="An inactive property.",
            status=PropertyStatus.DRAFT,
            price=Decimal("50000.00"),
            address="Test",
            city="Test",
            state="Test",
            agent=agent_user,
        )

        url = reverse("create-inquiry")
        data = {
            "property": str(inactive_property.id),
            "full_name": "Test User",
            "email": "test@example.com",
            "message": "Test message",
        }
        response = api_client.post(url, data)

        assert response.status_code == 400


@pytest.mark.django_db
class TestAgentInquiryViewSet:
    """Tests for AgentInquiryViewSet."""

    def test_list_inquiries(self, agent_client, sample_inquiry):
        """Test agent listing their inquiries."""
        url = reverse("agent-inquiries-list")
        response = agent_client.get(url)

        assert response.status_code == 200
        assert len(response.data["data"]) == 1

    def test_retrieve_inquiry(self, agent_client, sample_inquiry):
        """Test agent viewing inquiry details."""
        url = reverse("agent-inquiries-detail", args=[sample_inquiry.id])
        response = agent_client.get(url)

        assert response.status_code == 200
        assert response.data["data"]["full_name"] == "John Doe"

    def test_update_inquiry_status(self, agent_client, sample_inquiry):
        """Test agent updating inquiry status."""
        url = reverse("agent-inquiries-detail", args=[sample_inquiry.id])
        response = agent_client.patch(url, {"status": "contacted"})

        assert response.status_code == 200
        sample_inquiry.refresh_from_db()
        assert sample_inquiry.status == "contacted"

    def test_add_note_to_inquiry(self, agent_client, sample_inquiry):
        """Test agent adding a note to an inquiry."""
        url = reverse("agent-inquiries-add-note", args=[sample_inquiry.id])
        response = agent_client.post(url, {"content": "Called the client today."})

        assert response.status_code == 201
        assert sample_inquiry.notes.count() == 1

    def test_inquiry_stats(self, agent_client, sample_inquiry):
        """Test getting inquiry statistics."""
        url = reverse("agent-inquiries-stats")
        response = agent_client.get(url)

        assert response.status_code == 200
        assert response.data["data"]["total"] == 1
        assert response.data["data"]["new"] == 1

    def test_other_agent_cannot_view_inquiry(self, create_user, api_client, sample_inquiry):
        """Test that another agent cannot view someone else's inquiry."""
        other_agent = create_user(email="other@example.com", role="agent")
        api_client.force_authenticate(user=other_agent)

        url = reverse("agent-inquiries-detail", args=[sample_inquiry.id])
        response = api_client.get(url)

        assert response.status_code == 404
