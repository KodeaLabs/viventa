"""
Serializers for the accounts app.
"""

from rest_framework import serializers

from .models import User


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for User model (authenticated user).
    """

    full_name = serializers.CharField(read_only=True)
    display_name = serializers.CharField(read_only=True)

    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "first_name",
            "last_name",
            "full_name",
            "display_name",
            "phone",
            "avatar",
            "avatar_url",
            "slug",
            "role",
            "agent_type",
            "company_name",
            "license_number",
            "bio",
            "bio_es",
            "is_verified_agent",
            "logo",
            "website",
            "city",
            "state",
            "whatsapp",
            "instagram",
            "facebook",
            "linkedin",
            "preferred_language",
            "created_at",
        ]
        read_only_fields = ["id", "email", "slug", "role", "is_verified_agent", "created_at"]


class UserProfileUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for updating user profile.
    """

    class Meta:
        model = User
        fields = [
            "first_name",
            "last_name",
            "phone",
            "avatar",
            "avatar_url",
            "agent_type",
            "company_name",
            "license_number",
            "bio",
            "bio_es",
            "logo",
            "website",
            "founded_year",
            "city",
            "state",
            "whatsapp",
            "instagram",
            "facebook",
            "linkedin",
            "preferred_language",
        ]


class AgentPublicSerializer(serializers.ModelSerializer):
    """
    Public serializer for agent information (used in property listings).
    """

    full_name = serializers.CharField(read_only=True)
    display_name = serializers.CharField(read_only=True)
    location_display = serializers.CharField(read_only=True)

    class Meta:
        model = User
        fields = [
            "id",
            "slug",
            "full_name",
            "display_name",
            "avatar",
            "avatar_url",
            "agent_type",
            "company_name",
            "bio",
            "is_verified_agent",
            "phone",
            "whatsapp",
            "location_display",
        ]


class AgentListSerializer(serializers.ModelSerializer):
    """
    Serializer for agent/company listing (directory view).
    """

    display_name = serializers.CharField(read_only=True)
    location_display = serializers.CharField(read_only=True)
    active_listings_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = User
        fields = [
            "id",
            "slug",
            "display_name",
            "avatar",
            "avatar_url",
            "logo",
            "agent_type",
            "company_name",
            "is_verified_agent",
            "location_display",
            "active_listings_count",
            "total_listings",
            "total_sales",
        ]


class AgentDetailSerializer(serializers.ModelSerializer):
    """
    Detailed serializer for agent/company profile page ("Tu Página").
    """

    full_name = serializers.CharField(read_only=True)
    display_name = serializers.CharField(read_only=True)
    location_display = serializers.CharField(read_only=True)
    active_listings_count = serializers.IntegerField(read_only=True)
    team_members = serializers.SerializerMethodField()
    parent_company_info = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "id",
            "slug",
            "first_name",
            "last_name",
            "full_name",
            "display_name",
            "avatar",
            "avatar_url",
            "logo",
            "agent_type",
            "company_name",
            "license_number",
            "bio",
            "bio_es",
            "is_verified_agent",
            "website",
            "founded_year",
            "team_size",
            "city",
            "state",
            "location_display",
            "phone",
            "whatsapp",
            "instagram",
            "facebook",
            "linkedin",
            "active_listings_count",
            "total_listings",
            "total_sales",
            "team_members",
            "parent_company_info",
            "created_at",
        ]

    def get_team_members(self, obj):
        """Get team members for companies."""
        if obj.agent_type == 'company':
            members = obj.team_members.filter(role='agent', is_active=True)
            return AgentListSerializer(members, many=True).data
        return []

    def get_parent_company_info(self, obj):
        """Get parent company info for individual agents."""
        if obj.parent_company:
            return {
                "id": str(obj.parent_company.id),
                "slug": obj.parent_company.slug,
                "display_name": obj.parent_company.display_name,
                "logo": obj.parent_company.logo.url if obj.parent_company.logo else None,
                "is_verified": obj.parent_company.is_verified_agent,
            }
        return None


class AgentWithPropertiesSerializer(AgentDetailSerializer):
    """
    Agent profile with their property listings included.
    """

    properties = serializers.SerializerMethodField()

    class Meta(AgentDetailSerializer.Meta):
        fields = AgentDetailSerializer.Meta.fields + ["properties"]

    def get_properties(self, obj):
        from apps.properties.serializers import PropertyListSerializer
        properties = obj.properties.filter(status='active').order_by('-is_featured', '-created_at')[:12]
        return PropertyListSerializer(properties, many=True, context=self.context).data
