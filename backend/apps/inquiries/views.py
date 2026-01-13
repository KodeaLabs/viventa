"""
Views for the inquiries app.
"""

from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from apps.common.pagination import StandardResultsPagination

from .models import Inquiry, InquiryNote
from .serializers import (
    InquiryCreateSerializer,
    InquiryDetailSerializer,
    InquiryListSerializer,
    InquiryNoteSerializer,
    InquiryUpdateSerializer,
)


class PublicInquiryView(viewsets.GenericViewSet):
    """
    Public viewset for creating inquiries (no authentication required).
    """

    serializer_class = InquiryCreateSerializer
    permission_classes = [permissions.AllowAny]
    throttle_scope = "inquiries"

    def create(self, request):
        """Create a new inquiry."""
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            # Add tracking info
            inquiry = serializer.save(
                user=request.user if request.user.is_authenticated else None,
                ip_address=self.get_client_ip(request),
                user_agent=request.META.get("HTTP_USER_AGENT", ""),
                referrer=request.META.get("HTTP_REFERER", ""),
            )

            return Response(
                {
                    "success": True,
                    "data": {"id": str(inquiry.id)},
                    "message": "Your inquiry has been submitted successfully. The agent will contact you soon.",
                },
                status=status.HTTP_201_CREATED,
            )

        return Response(
            {"success": False, "error": serializer.errors},
            status=status.HTTP_400_BAD_REQUEST,
        )

    def get_client_ip(self, request):
        """Extract client IP from request."""
        x_forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
        if x_forwarded_for:
            return x_forwarded_for.split(",")[0].strip()
        return request.META.get("REMOTE_ADDR")


class AgentInquiryViewSet(viewsets.ModelViewSet):
    """
    Viewset for agents to manage inquiries on their properties.
    """

    permission_classes = [permissions.IsAuthenticated]
    pagination_class = StandardResultsPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["status", "preferred_language", "preferred_contact_method"]
    search_fields = ["full_name", "email", "phone", "message"]
    ordering_fields = ["created_at", "status"]
    ordering = ["-created_at"]

    def get_queryset(self):
        """Get inquiries for properties owned by the current agent."""
        user = self.request.user

        if user.is_staff:
            return Inquiry.objects.all().select_related("property_listing", "property_listing__agent")

        return Inquiry.objects.filter(property_listing__agent=user).select_related(
            "property_listing", "property_listing__agent"
        )

    def get_serializer_class(self):
        if self.action == "retrieve":
            return InquiryDetailSerializer
        if self.action in ["update", "partial_update"]:
            return InquiryUpdateSerializer
        return InquiryListSerializer

    def retrieve(self, request, *args, **kwargs):
        """Get inquiry details."""
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response({"success": True, "data": serializer.data})

    def update(self, request, *args, **kwargs):
        """Update inquiry status."""
        partial = kwargs.pop("partial", False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(
            {"success": True, "data": InquiryDetailSerializer(instance).data}
        )

    @action(detail=True, methods=["post"])
    def add_note(self, request, pk=None):
        """Add a note to an inquiry."""
        inquiry = self.get_object()
        content = request.data.get("content")

        if not content:
            return Response(
                {"success": False, "error": {"message": "Content is required"}},
                status=status.HTTP_400_BAD_REQUEST,
            )

        note = InquiryNote.objects.create(
            inquiry=inquiry, author=request.user, content=content
        )

        return Response(
            {"success": True, "data": InquiryNoteSerializer(note).data},
            status=status.HTTP_201_CREATED,
        )

    @action(detail=False, methods=["get"])
    def stats(self, request):
        """Get inquiry statistics for the agent."""
        queryset = self.get_queryset()

        stats = {
            "total": queryset.count(),
            "new": queryset.filter(status="new").count(),
            "contacted": queryset.filter(status="contacted").count(),
            "in_progress": queryset.filter(status="in_progress").count(),
            "qualified": queryset.filter(status="qualified").count(),
            "closed": queryset.filter(status="closed").count(),
        }

        return Response({"success": True, "data": stats})
