"""
Views for the properties app.
"""

from django.core.cache import cache
from django.db.models import F
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, generics, permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.response import Response

from apps.common.pagination import StandardResultsPagination

from .filters import PropertyFilter
from .models import Property, PropertyImage, PropertyStatus, SavedProperty
from .serializers import (
    PropertyCreateUpdateSerializer,
    PropertyDetailSerializer,
    PropertyImageSerializer,
    PropertyImageUploadSerializer,
    PropertyListSerializer,
    SavedPropertySerializer,
)


class IsVerifiedAgent(permissions.BasePermission):
    """
    Custom permission to allow only verified agents to create/edit properties.
    """

    message = "Solo los agentes verificados pueden publicar propiedades."

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        # Must be authenticated, an agent, AND verified
        return (
            request.user.is_authenticated
            and request.user.is_agent
            and request.user.is_verified_agent
        )

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.agent == request.user or request.user.is_staff


class PublicPropertyViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Public viewset for browsing properties (no authentication required).
    """

    serializer_class = PropertyListSerializer
    pagination_class = StandardResultsPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = PropertyFilter
    search_fields = ["title", "description", "address", "city"]
    ordering_fields = ["price", "created_at", "bedrooms", "area_sqm"]
    ordering = ["-created_at"]
    lookup_field = "slug"

    def get_queryset(self):
        return (
            Property.objects.filter(status=PropertyStatus.ACTIVE)
            .select_related("agent")
            .prefetch_related("images")
        )

    def get_serializer_class(self):
        if self.action == "retrieve":
            return PropertyDetailSerializer
        return PropertyListSerializer

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        # Increment view count
        Property.objects.filter(pk=instance.pk).update(view_count=F("view_count") + 1)
        serializer = self.get_serializer(instance)
        return Response({"success": True, "data": serializer.data})

    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)
        return response

    @action(detail=False, methods=["get"])
    def featured(self, request):
        """Get featured properties."""
        cache_key = "featured_properties"
        cached_data = cache.get(cache_key)

        if cached_data:
            return Response({"success": True, "data": cached_data})

        queryset = self.get_queryset().filter(is_featured=True)[:10]
        serializer = self.get_serializer(queryset, many=True)
        cache.set(cache_key, serializer.data, timeout=300)

        return Response({"success": True, "data": serializer.data})

    @action(detail=False, methods=["get"])
    def cities(self, request):
        """Get list of cities with property counts."""
        cities = (
            Property.objects.filter(status=PropertyStatus.ACTIVE)
            .values("city", "state")
            .annotate(count=models.Count("id"))
            .order_by("-count")
        )
        return Response({"success": True, "data": list(cities)})


# Import for Count
from django.db import models


class AgentPropertyViewSet(viewsets.ModelViewSet):
    """
    Viewset for agents to manage their own properties.
    Only verified agents can create/edit properties.
    """

    permission_classes = [IsVerifiedAgent]
    pagination_class = StandardResultsPagination
    parser_classes = [MultiPartParser, FormParser]

    def get_queryset(self):
        return (
            Property.objects.filter(agent=self.request.user)
            .select_related("agent", "location")
            .prefetch_related("images")
        )

    def get_serializer_class(self):
        if self.action in ["create", "update", "partial_update"]:
            return PropertyCreateUpdateSerializer
        if self.action == "retrieve":
            return PropertyDetailSerializer
        return PropertyListSerializer

    def perform_create(self, serializer):
        # New properties start as draft (FSM default)
        serializer.save(agent=self.request.user)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(
            {"success": True, "data": PropertyDetailSerializer(serializer.instance).data},
            status=status.HTTP_201_CREATED,
        )

    @action(detail=True, methods=["post"])
    def submit_for_review(self, request, pk=None):
        """Submit a property for admin review using FSM transition."""
        from django_fsm import can_proceed

        property_obj = self.get_object()

        # Check if transition is allowed
        if not can_proceed(property_obj.submit_for_review):
            return Response(
                {
                    "success": False,
                    "error": {"message": "No se puede enviar a revisión. Verifica que esté en borrador/rechazada y tenga todos los datos requeridos (título, descripción, precio, imágenes)."}
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Check conditions
        if not property_obj.can_submit_for_review():
            return Response(
                {
                    "success": False,
                    "error": {"message": "Faltan datos requeridos: título, descripción, precio y al menos una imagen."}
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Execute FSM transition
        property_obj.submit_for_review()
        property_obj.save()

        return Response({
            "success": True,
            "data": {
                "message": "Propiedad enviada a revisión. Recibirás una notificación cuando sea aprobada.",
                "status": property_obj.status,
            }
        })

    @action(detail=True, methods=["post"])
    def deactivate(self, request, pk=None):
        """Deactivate a property using FSM transition."""
        from django_fsm import can_proceed

        property_obj = self.get_object()

        if not can_proceed(property_obj.deactivate):
            return Response(
                {
                    "success": False,
                    "error": {"message": "Solo puedes desactivar propiedades activas."}
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        property_obj.deactivate()
        property_obj.save()

        return Response({
            "success": True,
            "data": {"message": "Propiedad desactivada.", "status": property_obj.status}
        })

    @action(detail=True, methods=["post"])
    def reactivate(self, request, pk=None):
        """Reactivate a property using FSM transition - goes back to pending review."""
        from django_fsm import can_proceed

        property_obj = self.get_object()

        if not can_proceed(property_obj.reactivate):
            return Response(
                {
                    "success": False,
                    "error": {"message": "Solo puedes reactivar propiedades desactivadas."}
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        property_obj.reactivate()
        property_obj.save()

        return Response({
            "success": True,
            "data": {
                "message": "Propiedad enviada a revisión para reactivación.",
                "status": property_obj.status,
            }
        })

    @action(detail=True, methods=["post"])
    def mark_sold(self, request, pk=None):
        """Mark property as sold using FSM transition."""
        from django_fsm import can_proceed

        property_obj = self.get_object()

        if not can_proceed(property_obj.mark_as_sold):
            return Response(
                {
                    "success": False,
                    "error": {"message": "Solo puedes marcar como vendidas propiedades activas."}
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        property_obj.mark_as_sold()
        property_obj.save()

        return Response({
            "success": True,
            "data": {"message": "Propiedad marcada como vendida.", "status": property_obj.status}
        })

    @action(detail=True, methods=["post"])
    def mark_rented(self, request, pk=None):
        """Mark property as rented using FSM transition."""
        from django_fsm import can_proceed

        property_obj = self.get_object()

        if not can_proceed(property_obj.mark_as_rented):
            return Response(
                {
                    "success": False,
                    "error": {"message": "Solo puedes marcar como alquiladas propiedades activas."}
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        property_obj.mark_as_rented()
        property_obj.save()

        return Response({
            "success": True,
            "data": {"message": "Propiedad marcada como alquilada.", "status": property_obj.status}
        })

    @action(detail=True, methods=["post"], parser_classes=[MultiPartParser, FormParser])
    def upload_image(self, request, pk=None):
        """Upload an image for a property."""
        property_obj = self.get_object()
        serializer = PropertyImageUploadSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save(property=property_obj)
            return Response(
                {"success": True, "data": PropertyImageSerializer(serializer.instance).data},
                status=status.HTTP_201_CREATED,
            )
        return Response(
            {"success": False, "error": serializer.errors},
            status=status.HTTP_400_BAD_REQUEST,
        )

    @action(detail=True, methods=["delete"], url_path="images/(?P<image_id>[^/.]+)")
    def delete_image(self, request, pk=None, image_id=None):
        """Delete an image from a property."""
        property_obj = self.get_object()
        try:
            image = PropertyImage.objects.get(id=image_id, property=property_obj)
            image.delete()
            return Response({"success": True, "message": "Image deleted"})
        except PropertyImage.DoesNotExist:
            return Response(
                {"success": False, "error": {"message": "Image not found"}},
                status=status.HTTP_404_NOT_FOUND,
            )


class SavedPropertyViewSet(viewsets.ModelViewSet):
    """
    Viewset for managing saved/favorited properties.
    """

    serializer_class = SavedPropertySerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = StandardResultsPagination

    def get_queryset(self):
        return SavedProperty.objects.filter(user=self.request.user).select_related(
            "property", "property__agent"
        )

    @action(detail=False, methods=["post"])
    def toggle(self, request):
        """Toggle save status for a property."""
        property_id = request.data.get("property_id")

        if not property_id:
            return Response(
                {"success": False, "error": {"message": "property_id is required"}},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            property_obj = Property.objects.get(id=property_id)
        except Property.DoesNotExist:
            return Response(
                {"success": False, "error": {"message": "Property not found"}},
                status=status.HTTP_404_NOT_FOUND,
            )

        saved, created = SavedProperty.objects.get_or_create(
            user=request.user, property=property_obj
        )

        if not created:
            saved.delete()
            return Response({"success": True, "data": {"is_saved": False}})

        return Response(
            {"success": True, "data": {"is_saved": True}},
            status=status.HTTP_201_CREATED,
        )
