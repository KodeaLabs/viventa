"""
Serializers for the properties app.
"""

from rest_framework import serializers

from apps.accounts.serializers import AgentPublicSerializer

from .models import Property, PropertyImage, SavedProperty


class PropertyImageSerializer(serializers.ModelSerializer):
    """
    Serializer for property images.
    Supports both uploaded images and external URLs.
    """

    url = serializers.SerializerMethodField()
    thumbnail_url = serializers.SerializerMethodField()
    large_url = serializers.SerializerMethodField()

    class Meta:
        model = PropertyImage
        fields = [
            "id",
            "url",
            "image",
            "image_url",
            "thumbnail_url",
            "large_url",
            "caption",
            "is_main",
            "order",
        ]
        read_only_fields = ["id", "url", "thumbnail_url", "large_url"]

    def get_url(self, obj):
        """Return the primary image URL (uploaded or external)."""
        if obj.image:
            request = self.context.get("request")
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return obj.image_url or None

    def get_thumbnail_url(self, obj):
        # For external URLs, return the URL directly (no thumbnail processing)
        if obj.image_url and not obj.image:
            return obj.image_url
        if obj.image and obj.thumbnail:
            request = self.context.get("request")
            if request:
                return request.build_absolute_uri(obj.thumbnail.url)
            return obj.thumbnail.url
        return None

    def get_large_url(self, obj):
        # For external URLs, return the URL directly
        if obj.image_url and not obj.image:
            return obj.image_url
        if obj.image and obj.large:
            request = self.context.get("request")
            if request:
                return request.build_absolute_uri(obj.large.url)
            return obj.large.url
        return None


class PropertyListSerializer(serializers.ModelSerializer):
    """
    Serializer for property list view (minimal data).
    """

    main_image = serializers.SerializerMethodField()
    location_display = serializers.CharField(read_only=True)
    agent_name = serializers.CharField(source="agent.full_name", read_only=True)

    class Meta:
        model = Property
        fields = [
            "id",
            "slug",
            "title",
            "price",
            "property_type",
            "listing_type",
            "status",
            "bedrooms",
            "bathrooms",
            "area_sqm",
            "city",
            "state",
            "location_display",
            "main_image",
            "agent_name",
            "is_featured",
            "is_beachfront",
            "is_investment_opportunity",
            "created_at",
        ]

    def get_main_image(self, obj):
        main_img = obj.main_image
        if main_img:
            # Check for external URL first
            if main_img.image_url and not main_img.image:
                return main_img.image_url
            # Then check for uploaded image thumbnail
            request = self.context.get("request")
            if main_img.image:
                if main_img.thumbnail:
                    if request:
                        return request.build_absolute_uri(main_img.thumbnail.url)
                    return main_img.thumbnail.url
                # Fallback to original image
                if request:
                    return request.build_absolute_uri(main_img.image.url)
                return main_img.image.url
        return None


class PropertyDetailSerializer(serializers.ModelSerializer):
    """
    Serializer for property detail view (full data).
    """

    images = PropertyImageSerializer(many=True, read_only=True)
    agent = AgentPublicSerializer(read_only=True)
    location_display = serializers.CharField(read_only=True)
    is_saved = serializers.SerializerMethodField()

    class Meta:
        model = Property
        fields = [
            "id",
            "slug",
            "title",
            "description",
            "description_es",
            "price",
            "price_negotiable",
            "property_type",
            "listing_type",
            "status",
            "bedrooms",
            "bathrooms",
            "area_sqm",
            "lot_size_sqm",
            "year_built",
            "parking_spaces",
            "address",
            "city",
            "state",
            "zip_code",
            "country",
            "latitude",
            "longitude",
            "location_display",
            "features",
            "agent",
            "images",
            "is_featured",
            "is_new_construction",
            "is_beachfront",
            "is_investment_opportunity",
            "view_count",
            "is_saved",
            "created_at",
            "updated_at",
        ]

    def get_is_saved(self, obj):
        request = self.context.get("request")
        if request and request.user.is_authenticated:
            return SavedProperty.objects.filter(
                user=request.user, property=obj
            ).exists()
        return False


class PropertyCreateUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating and updating properties (agent use).
    """

    class Meta:
        model = Property
        fields = [
            "title",
            "description",
            "description_es",
            "price",
            "price_negotiable",
            "property_type",
            "listing_type",
            "status",
            "bedrooms",
            "bathrooms",
            "area_sqm",
            "lot_size_sqm",
            "year_built",
            "parking_spaces",
            "address",
            "city",
            "state",
            "zip_code",
            "latitude",
            "longitude",
            "features",
            "is_new_construction",
            "is_beachfront",
            "is_investment_opportunity",
        ]

    def validate_status(self, value):
        """Prevent agents from directly setting featured status."""
        # Only admins can set certain statuses
        request = self.context.get("request")
        if request and not request.user.is_staff:
            if value not in ["draft", "active", "inactive"]:
                raise serializers.ValidationError(
                    "You can only set status to draft, active, or inactive."
                )
        return value


class PropertyImageUploadSerializer(serializers.ModelSerializer):
    """
    Serializer for uploading property images.
    """

    class Meta:
        model = PropertyImage
        fields = ["image", "caption", "is_main", "order"]


class SavedPropertySerializer(serializers.ModelSerializer):
    """
    Serializer for saved properties.
    """

    property = PropertyListSerializer(read_only=True)

    class Meta:
        model = SavedProperty
        fields = ["id", "property", "created_at"]
        read_only_fields = ["id", "created_at"]
