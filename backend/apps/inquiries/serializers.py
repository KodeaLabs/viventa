"""
Serializers for the inquiries app.
"""

from rest_framework import serializers

from apps.properties.models import Property
from apps.properties.serializers import PropertyListSerializer

from .models import Inquiry, InquiryNote


class InquiryCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating new inquiries (public form).
    """

    property = serializers.PrimaryKeyRelatedField(
        queryset=Property.objects.all(),
        source="property_listing",
    )

    class Meta:
        model = Inquiry
        fields = [
            "property",
            "full_name",
            "email",
            "phone",
            "country",
            "message",
            "preferred_contact_method",
            "preferred_language",
            "budget_min",
            "budget_max",
        ]

    def validate_property(self, value):
        if value.status != "active":
            raise serializers.ValidationError(
                "Cannot inquire about inactive properties."
            )
        return value


class InquiryNoteSerializer(serializers.ModelSerializer):
    """
    Serializer for inquiry notes.
    """

    author_name = serializers.CharField(source="author.full_name", read_only=True)

    class Meta:
        model = InquiryNote
        fields = ["id", "content", "author_name", "created_at"]
        read_only_fields = ["id", "author_name", "created_at"]


class InquiryListSerializer(serializers.ModelSerializer):
    """
    Serializer for listing inquiries (agent view).
    """

    property_title = serializers.CharField(source="property_listing.title", read_only=True)
    property_id = serializers.UUIDField(source="property_listing.id", read_only=True)

    class Meta:
        model = Inquiry
        fields = [
            "id",
            "property_id",
            "property_title",
            "full_name",
            "email",
            "phone",
            "country",
            "status",
            "preferred_contact_method",
            "preferred_language",
            "created_at",
        ]


class InquiryDetailSerializer(serializers.ModelSerializer):
    """
    Serializer for inquiry details (agent view).
    """

    property = PropertyListSerializer(source="property_listing", read_only=True)
    notes = InquiryNoteSerializer(many=True, read_only=True)

    class Meta:
        model = Inquiry
        fields = [
            "id",
            "property",
            "full_name",
            "email",
            "phone",
            "country",
            "message",
            "preferred_contact_method",
            "preferred_language",
            "budget_min",
            "budget_max",
            "status",
            "internal_notes",
            "notes",
            "created_at",
            "updated_at",
        ]


class InquiryUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for updating inquiry status (agent use).
    """

    class Meta:
        model = Inquiry
        fields = ["status", "internal_notes"]
