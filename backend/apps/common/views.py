"""
Views for the common app.
"""

from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Location
from .serializers import LocationSerializer, LocationDetailSerializer


class LocationViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Public viewset for browsing locations.
    """

    serializer_class = LocationSerializer
    lookup_field = "slug"

    def get_queryset(self):
        return Location.objects.filter(is_active=True).order_by("display_order", "name")

    def get_serializer_class(self):
        if self.action == "retrieve":
            return LocationDetailSerializer
        return LocationSerializer

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        return Response({"success": True, "data": serializer.data})

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response({"success": True, "data": serializer.data})

    @action(detail=False, methods=["get"])
    def featured(self, request):
        """Get featured locations."""
        queryset = self.get_queryset().filter(is_featured=True)
        serializer = self.get_serializer(queryset, many=True)
        return Response({"success": True, "data": serializer.data})

    @action(detail=False, methods=["get"])
    def by_type(self, request):
        """Get locations grouped by type."""
        queryset = self.get_queryset()
        grouped = {}

        for location in queryset:
            loc_type = location.location_type
            if loc_type not in grouped:
                grouped[loc_type] = []
            grouped[loc_type].append(LocationSerializer(location).data)

        return Response({"success": True, "data": grouped})
