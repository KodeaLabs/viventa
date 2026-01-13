"""
API v1 URL configuration.
"""

from django.urls import include, path
from rest_framework.routers import DefaultRouter

from apps.accounts.views import (
    BecomeAgentView,
    CurrentUserView,
    health_check,
    AgentListView,
    AgentDetailView,
    CompanyAgentsView,
    FeaturedAgentsView,
    ReferrerListView,
)
from apps.common.views import LocationViewSet
from apps.inquiries.views import AgentInquiryViewSet, PublicInquiryView
from apps.properties.views import (
    AgentPropertyViewSet,
    PublicPropertyViewSet,
    SavedPropertyViewSet,
)

# Create routers
router = DefaultRouter()

# Public routes (no auth required)
router.register(r"properties", PublicPropertyViewSet, basename="public-properties")
router.register(r"locations", LocationViewSet, basename="locations")

# Agent routes (auth required)
router.register(r"agent/properties", AgentPropertyViewSet, basename="agent-properties")
router.register(r"agent/inquiries", AgentInquiryViewSet, basename="agent-inquiries")

# User routes
router.register(r"saved-properties", SavedPropertyViewSet, basename="saved-properties")

urlpatterns = [
    # Health check
    path("health/", health_check, name="health-check"),
    # Auth routes
    path("auth/me/", CurrentUserView.as_view(), name="current-user"),
    path("auth/become-agent/", BecomeAgentView.as_view(), name="become-agent"),
    path("auth/referrers/", ReferrerListView.as_view(), name="referrer-list"),
    # Public inquiry creation
    path(
        "inquiries/",
        PublicInquiryView.as_view({"post": "create"}),
        name="create-inquiry",
    ),
    # Agent/Company directory routes
    path("agents/", AgentListView.as_view(), name="agent-list"),
    path("agents/featured/", FeaturedAgentsView.as_view(), name="featured-agents"),
    path("agents/<slug:slug>/", AgentDetailView.as_view(), name="agent-detail"),
    path("agents/<slug:company_slug>/team/", CompanyAgentsView.as_view(), name="company-agents"),
    # Router URLs
    path("", include(router.urls)),
]
