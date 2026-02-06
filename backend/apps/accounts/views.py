"""
Views for the accounts app.
"""

from django.db.models import Count, Q
from rest_framework import generics, permissions, status, filters
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from django_filters.rest_framework import DjangoFilterBackend

from .models import User
from .serializers import (
    UserProfileUpdateSerializer,
    UserSerializer,
    AgentListSerializer,
    AgentDetailSerializer,
    AgentWithPropertiesSerializer,
)


class CurrentUserView(APIView):
    """
    Get or update the current authenticated user.
    """

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response({"success": True, "data": serializer.data})

    def patch(self, request):
        serializer = UserProfileUpdateSerializer(
            request.user, data=request.data, partial=True
        )
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"success": True, "data": UserSerializer(request.user).data}
            )
        return Response(
            {"success": False, "error": serializer.errors},
            status=status.HTTP_400_BAD_REQUEST,
        )


class BecomeAgentView(APIView):
    """
    Request to become a real estate agent.
    """

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        from django.utils import timezone

        user = request.user

        if user.role == User.Role.AGENT:
            return Response(
                {"success": False, "error": {"message": "User is already an agent"}},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Get agent type from request (default to individual)
        agent_type = request.data.get("agent_type", "individual")
        if agent_type not in ["individual", "company"]:
            return Response(
                {"success": False, "error": {"message": "Invalid agent type"}},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Handle referral
        referrer_id = request.data.get("referred_by")
        referrer = None
        if referrer_id:
            try:
                referrer = User.objects.get(id=referrer_id, is_referrer=True, is_active=True)
            except User.DoesNotExist:
                return Response(
                    {"success": False, "error": {"message": "Invalid referrer"}},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        # Update role to agent (verification happens separately)
        user.role = User.Role.AGENT
        user.agent_type = agent_type

        # Set referral info if provided
        if referrer:
            user.referred_by = referrer
            user.referral_date = timezone.now()
            user.referral_fee_status = "pending"

        user.save()

        return Response(
            {
                "success": True,
                "data": UserSerializer(user).data,
                "message": "You are now registered as an agent. Verification pending.",
            }
        )


class AgentListView(generics.ListAPIView):
    """
    List all agents and companies (public directory).
    """

    serializer_class = AgentListSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["agent_type", "city", "state", "is_verified_agent"]
    search_fields = ["first_name", "last_name", "company_name", "city", "state"]
    ordering_fields = ["created_at", "total_listings", "total_sales"]
    ordering = ["-is_verified_agent", "-total_listings"]

    def get_queryset(self):
        return User.objects.filter(
            role=User.Role.AGENT,
            is_active=True,
        ).annotate(
            active_listings_count=Count(
                "properties",
                filter=Q(properties__status="active")
            )
        )

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        # Pagination
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            response = self.get_paginated_response(serializer.data)
            return Response({
                "success": True,
                "data": response.data["results"],
                "meta": {
                    "count": response.data["count"],
                    "next": response.data["next"],
                    "previous": response.data["previous"],
                }
            })

        serializer = self.get_serializer(queryset, many=True)
        return Response({"success": True, "data": serializer.data})


class AgentDetailView(generics.RetrieveAPIView):
    """
    Get agent/company profile by slug ("Tu Página").
    """

    serializer_class = AgentWithPropertiesSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = "slug"

    def get_queryset(self):
        return User.objects.filter(
            role=User.Role.AGENT,
            is_active=True,
        ).annotate(
            active_listings_count=Count(
                "properties",
                filter=Q(properties__status="active")
            )
        )

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, context={"request": request})
        return Response({"success": True, "data": serializer.data})


class CompanyAgentsView(generics.ListAPIView):
    """
    List agents working for a specific company.
    """

    serializer_class = AgentListSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        company_slug = self.kwargs.get("company_slug")
        return User.objects.filter(
            role=User.Role.AGENT,
            is_active=True,
            parent_company__slug=company_slug,
        ).annotate(
            active_listings_count=Count(
                "properties",
                filter=Q(properties__status="active")
            )
        )

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response({"success": True, "data": serializer.data})


class FeaturedAgentsView(generics.ListAPIView):
    """
    List featured/verified agents and companies.
    """

    serializer_class = AgentListSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return User.objects.filter(
            role=User.Role.AGENT,
            is_active=True,
            is_verified_agent=True,
        ).annotate(
            active_listings_count=Count(
                "properties",
                filter=Q(properties__status="active")
            )
        ).order_by("-total_listings")[:8]

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response({"success": True, "data": serializer.data})


class ReferrerListView(generics.ListAPIView):
    """
    List available referrers for agent registration.
    """

    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return User.objects.filter(
            is_referrer=True,
            is_active=True,
        ).order_by("first_name", "last_name")

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        data = [
            {
                "id": user.id,
                "name": user.full_name,
                "email": user.email,
            }
            for user in queryset
        ]
        return Response({"success": True, "data": data})


@api_view(["GET"])
@permission_classes([permissions.AllowAny])
def health_check(request):
    """
    Health check endpoint for monitoring.
    """
    return Response({"status": "healthy", "service": "viventi-api"})
