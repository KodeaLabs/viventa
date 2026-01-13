"""
Admin configuration for the accounts app.
"""

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.html import format_html

from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """
    Custom admin for User model.
    """

    list_display = [
        "email",
        "display_name_admin",
        "agent_type",
        "role",
        "is_verified_agent",
        "referred_by_admin",
        "referral_fee_status",
        "location_admin",
        "property_count",
        "is_active",
        "created_at",
    ]
    list_filter = [
        "role",
        "agent_type",
        "is_verified_agent",
        "is_referrer",
        "referral_fee_status",
        "is_active",
        "is_staff",
        "city",
        "state",
        "created_at",
    ]
    search_fields = ["email", "first_name", "last_name", "company_name", "phone", "city", "slug", "referred_by__email"]
    ordering = ["-created_at"]
    readonly_fields = ["auth0_id", "slug", "referral_date", "created_at", "updated_at", "last_login", "referral_count"]

    fieldsets = (
        (None, {"fields": ("email", "password")}),
        (
            "Personal Info",
            {
                "fields": (
                    "first_name",
                    "last_name",
                    "phone",
                    "avatar",
                    "preferred_language",
                )
            },
        ),
        (
            "Agent Profile",
            {
                "fields": (
                    "agent_type",
                    "company_name",
                    "slug",
                    "license_number",
                    "bio",
                    "bio_es",
                    "is_verified_agent",
                ),
            },
        ),
        (
            "Company/Broker Details",
            {
                "fields": (
                    "logo",
                    "website",
                    "founded_year",
                    "team_size",
                    "parent_company",
                ),
                "classes": ("collapse",),
            },
        ),
        (
            "Location",
            {
                "fields": ("city", "state"),
            },
        ),
        (
            "Social & Contact",
            {
                "fields": (
                    "whatsapp",
                    "instagram",
                    "facebook",
                    "linkedin",
                ),
                "classes": ("collapse",),
            },
        ),
        (
            "Stats",
            {
                "fields": ("total_listings", "total_sales"),
                "classes": ("collapse",),
            },
        ),
        (
            "Referral System",
            {
                "fields": (
                    "is_referrer",
                    "referred_by",
                    "referral_date",
                    "referral_fee_status",
                    "referral_notes",
                    "referral_count",
                ),
                "description": "Track who referred this agent and manage referral fees.",
            },
        ),
        (
            "Permissions",
            {
                "fields": (
                    "role",
                    "is_active",
                    "is_staff",
                    "is_superuser",
                    "groups",
                    "user_permissions",
                ),
            },
        ),
        (
            "Auth0",
            {
                "fields": ("auth0_id",),
                "classes": ("collapse",),
            },
        ),
        (
            "Timestamps",
            {
                "fields": ("last_login", "created_at", "updated_at"),
                "classes": ("collapse",),
            },
        ),
    )

    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": (
                    "email",
                    "password1",
                    "password2",
                    "first_name",
                    "last_name",
                    "role",
                ),
            },
        ),
    )

    actions = ["verify_agents", "unverify_agents", "mark_referral_paid", "make_referrer"]

    @admin.action(description="Verify selected agents")
    def verify_agents(self, request, queryset):
        updated = queryset.filter(role=User.Role.AGENT).update(is_verified_agent=True)
        self.message_user(request, f"{updated} agent(s) verified successfully.")

    @admin.action(description="Remove verification from selected agents")
    def unverify_agents(self, request, queryset):
        updated = queryset.update(is_verified_agent=False)
        self.message_user(request, f"{updated} agent(s) unverified.")

    @admin.action(description="Mark referral fee as PAID")
    def mark_referral_paid(self, request, queryset):
        updated = queryset.filter(referral_fee_status="pending").update(referral_fee_status="paid")
        self.message_user(request, f"{updated} referral fee(s) marked as paid.")

    @admin.action(description="Allow selected users to refer agents")
    def make_referrer(self, request, queryset):
        updated = queryset.update(is_referrer=True)
        self.message_user(request, f"{updated} user(s) can now refer agents.")

    def full_name(self, obj):
        return obj.full_name

    full_name.short_description = "Name"

    def display_name_admin(self, obj):
        """Display name with verification badge."""
        name = obj.display_name
        if obj.is_verified_agent:
            return format_html('{} <span style="color: #22c55e;">✓</span>', name)
        return name

    display_name_admin.short_description = "Name"

    def location_admin(self, obj):
        """Display location."""
        return obj.location_display

    location_admin.short_description = "Location"

    def property_count(self, obj):
        """Display count of properties for agents."""
        if obj.role == User.Role.AGENT:
            count = obj.properties.count()
            return count
        return "-"

    property_count.short_description = "Properties"

    def referred_by_admin(self, obj):
        """Display who referred this agent."""
        if obj.referred_by:
            return format_html(
                '<a href="/admin/accounts/user/{}/change/">{}</a>',
                obj.referred_by.id,
                obj.referred_by.full_name
            )
        return "-"

    referred_by_admin.short_description = "Referred By"

    def referral_count(self, obj):
        """Display how many agents this user has referred."""
        count = obj.referrals.count()
        if count > 0:
            pending = obj.referrals.filter(referral_fee_status="pending").count()
            if pending > 0:
                return format_html(
                    '{} <span style="color: #f59e0b;">({} pending)</span>',
                    count, pending
                )
            return count
        return "0"

    referral_count.short_description = "Referrals Made"
