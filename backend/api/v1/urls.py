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
from apps.projects.views import (
    AdminAssetViewSet,
    AdminContractViewSet,
    AdminMilestoneViewSet,
    AdminPaymentViewSet,
    AdminProjectUpdateViewSet,
    AdminProjectViewSet,
    BuyerContractViewSet,
    PublicProjectViewSet,
)
from apps.properties.views import (
    AgentPropertyViewSet,
    PublicPropertyViewSet,
    SavedPropertyViewSet,
)

# Create routers
router = DefaultRouter()

# Public routes (no auth required)
router.register(r"properties", PublicPropertyViewSet, basename="public-properties")
router.register(r"projects", PublicProjectViewSet, basename="public-projects")
router.register(r"locations", LocationViewSet, basename="locations")

# Agent routes (auth required)
router.register(r"agent/properties", AgentPropertyViewSet, basename="agent-properties")
router.register(r"agent/inquiries", AgentInquiryViewSet, basename="agent-inquiries")

# Project admin routes
router.register(r"admin/projects", AdminProjectViewSet, basename="admin-projects")

# Buyer routes
router.register(r"my/contracts", BuyerContractViewSet, basename="buyer-contracts")

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
    # Project admin nested routes - Assets
    path(
        "admin/projects/<uuid:project_pk>/assets/",
        AdminAssetViewSet.as_view({"get": "list", "post": "create"}),
        name="admin-project-assets-list",
    ),
    path(
        "admin/projects/<uuid:project_pk>/assets/<uuid:pk>/",
        AdminAssetViewSet.as_view(
            {"get": "retrieve", "put": "update", "patch": "partial_update", "delete": "destroy"}
        ),
        name="admin-project-assets-detail",
    ),
    path(
        "admin/projects/<uuid:project_pk>/assets/<uuid:pk>/reserve/",
        AdminAssetViewSet.as_view({"post": "reserve"}),
        name="admin-asset-reserve",
    ),
    path(
        "admin/projects/<uuid:project_pk>/assets/<uuid:pk>/mark_sold/",
        AdminAssetViewSet.as_view({"post": "mark_sold"}),
        name="admin-asset-mark-sold",
    ),
    path(
        "admin/projects/<uuid:project_pk>/assets/<uuid:pk>/deliver/",
        AdminAssetViewSet.as_view({"post": "deliver"}),
        name="admin-asset-deliver",
    ),
    path(
        "admin/projects/<uuid:project_pk>/assets/<uuid:pk>/release/",
        AdminAssetViewSet.as_view({"post": "release"}),
        name="admin-asset-release",
    ),
    # Project admin nested routes - Milestones
    path(
        "admin/projects/<uuid:project_pk>/milestones/",
        AdminMilestoneViewSet.as_view({"get": "list", "post": "create"}),
        name="admin-project-milestones-list",
    ),
    path(
        "admin/projects/<uuid:project_pk>/milestones/<uuid:pk>/",
        AdminMilestoneViewSet.as_view(
            {"get": "retrieve", "put": "update", "patch": "partial_update", "delete": "destroy"}
        ),
        name="admin-project-milestones-detail",
    ),
    # Project admin nested routes - Contracts
    path(
        "admin/projects/<uuid:project_pk>/contracts/",
        AdminContractViewSet.as_view({"get": "list", "post": "create"}),
        name="admin-project-contracts-list",
    ),
    path(
        "admin/projects/<uuid:project_pk>/contracts/<uuid:pk>/",
        AdminContractViewSet.as_view(
            {"get": "retrieve", "put": "update", "patch": "partial_update", "delete": "destroy"}
        ),
        name="admin-project-contracts-detail",
    ),
    path(
        "admin/projects/<uuid:project_pk>/contracts/<uuid:pk>/sign/",
        AdminContractViewSet.as_view({"post": "sign"}),
        name="admin-contract-sign",
    ),
    path(
        "admin/projects/<uuid:project_pk>/contracts/<uuid:pk>/activate/",
        AdminContractViewSet.as_view({"post": "activate"}),
        name="admin-contract-activate",
    ),
    path(
        "admin/projects/<uuid:project_pk>/contracts/<uuid:pk>/complete/",
        AdminContractViewSet.as_view({"post": "complete"}),
        name="admin-contract-complete",
    ),
    path(
        "admin/projects/<uuid:project_pk>/contracts/<uuid:pk>/cancel_contract/",
        AdminContractViewSet.as_view({"post": "cancel_contract"}),
        name="admin-contract-cancel",
    ),
    # Project admin nested routes - Payments
    path(
        "admin/projects/<uuid:project_pk>/contracts/<uuid:contract_pk>/payments/",
        AdminPaymentViewSet.as_view({"get": "list", "post": "create"}),
        name="admin-contract-payments-list",
    ),
    path(
        "admin/projects/<uuid:project_pk>/contracts/<uuid:contract_pk>/payments/<uuid:pk>/",
        AdminPaymentViewSet.as_view(
            {"get": "retrieve", "put": "update", "patch": "partial_update", "delete": "destroy"}
        ),
        name="admin-contract-payments-detail",
    ),
    # Project admin nested routes - Updates
    path(
        "admin/projects/<uuid:project_pk>/updates/",
        AdminProjectUpdateViewSet.as_view({"get": "list", "post": "create"}),
        name="admin-project-updates-list",
    ),
    path(
        "admin/projects/<uuid:project_pk>/updates/<uuid:pk>/",
        AdminProjectUpdateViewSet.as_view(
            {"get": "retrieve", "put": "update", "patch": "partial_update", "delete": "destroy"}
        ),
        name="admin-project-updates-detail",
    ),
    # Router URLs (must be last)
    path("", include(router.urls)),
]
