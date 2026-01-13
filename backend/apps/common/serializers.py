"""
Serializers for the common app.
"""

from rest_framework import serializers

from .models import Location


class LocationSerializer(serializers.ModelSerializer):
    """
    Serializer for Location list view.
    """

    display_name = serializers.CharField(read_only=True)
    property_count = serializers.SerializerMethodField()

    class Meta:
        model = Location
        fields = [
            "id",
            "name",
            "name_es",
            "slug",
            "location_type",
            "state",
            "latitude",
            "longitude",
            "image_url",
            "is_featured",
            "display_name",
            "property_count",
        ]

    def get_property_count(self, obj):
        """Get count of active properties in this location."""
        return obj.properties.filter(status="active").count()


class LocationDetailSerializer(LocationSerializer):
    """
    Detailed serializer for Location.
    """

    children = serializers.SerializerMethodField()

    class Meta(LocationSerializer.Meta):
        fields = LocationSerializer.Meta.fields + [
            "description",
            "description_es",
            "children",
        ]

    def get_children(self, obj):
        """Get child locations."""
        children = obj.children.filter(is_active=True).order_by("display_order", "name")
        return LocationSerializer(children, many=True).data
