"""
Admin configuration for the properties app.
"""

from django import forms
from django.contrib import admin
from django.utils import timezone
from django.utils.html import format_html

from apps.accounts.models import User
from apps.common.models import Location
from .models import Property, PropertyImage, SavedProperty, PropertyStatus


class PropertyAdminForm(forms.ModelForm):
    """Custom form for Property admin to filter agents."""

    class Meta:
        model = Property
        fields = "__all__"

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Only show agents in the agent dropdown
        if "agent" in self.fields:
            self.fields["agent"].queryset = User.objects.filter(
                role=User.Role.AGENT, is_active=True
            ).order_by("company_name", "first_name", "last_name")
            self.fields["agent"].label_from_instance = lambda obj: f"{obj.display_name} ({obj.email}) - {obj.location_display}"


class PropertyImageInline(admin.TabularInline):
    """
    Inline admin for property images.
    """

    model = PropertyImage
    extra = 1
    fields = ["image", "image_preview", "caption", "is_main", "order"]
    readonly_fields = ["image_preview"]

    def image_preview(self, obj):
        if obj.image:
            return format_html(
                '<img src="{}" style="max-height: 100px; max-width: 150px;" />',
                obj.image.url,
            )
        return "-"

    image_preview.short_description = "Preview"


@admin.register(Property)
class PropertyAdmin(admin.ModelAdmin):
    """
    Admin for Property model.
    Allows admins to create properties and assign them to agents.
    Uses FSM for status transitions with proper workflow.
    """

    form = PropertyAdminForm

    list_display = [
        "title",
        "price_display",
        "property_type",
        "listing_type",
        "status",
        "city",
        "agent_display",
        "is_featured",
        "view_count",
        "created_at",
    ]
    list_filter = [
        "status",
        "property_type",
        "listing_type",
        "is_featured",
        "is_beachfront",
        "is_new_construction",
        "is_investment_opportunity",
        "location",
        "agent",
        "city",
        "state",
        "created_at",
    ]
    search_fields = [
        "title",
        "description",
        "address",
        "city",
        "agent__email",
        "agent__first_name",
        "agent__last_name",
        "agent__company_name",
    ]
    ordering = ["-created_at"]
    readonly_fields = ["slug", "status", "view_count", "created_at", "updated_at", "submitted_at", "reviewed_at", "reviewed_by"]
    prepopulated_fields = {"slug": ("title",)}
    inlines = [PropertyImageInline]

    fieldsets = (
        (
            "Basic Information",
            {
                "fields": ("title", "slug", "description", "description_es"),
            },
        ),
        (
            "Property Details",
            {
                "fields": (
                    "property_type",
                    "listing_type",
                    "status",
                    "price",
                    "price_negotiable",
                ),
            },
        ),
        (
            "Features",
            {
                "fields": (
                    "bedrooms",
                    "bathrooms",
                    "area_sqm",
                    "lot_size_sqm",
                    "year_built",
                    "parking_spaces",
                    "features",
                ),
            },
        ),
        (
            "Location",
            {
                "fields": (
                    "location",
                    "address",
                    "city",
                    "state",
                    "zip_code",
                    "country",
                    "latitude",
                    "longitude",
                ),
            },
        ),
        (
            "Flags",
            {
                "fields": (
                    "is_featured",
                    "is_new_construction",
                    "is_beachfront",
                    "is_investment_opportunity",
                ),
            },
        ),
        (
            "Agent & Stats",
            {
                "fields": ("agent", "view_count"),
            },
        ),
        (
            "Approval Workflow",
            {
                "fields": (
                    "submitted_at",
                    "reviewed_by",
                    "reviewed_at",
                    "rejection_reason",
                    "admin_notes",
                ),
                "classes": ("collapse",),
            },
        ),
        (
            "Timestamps",
            {
                "fields": ("created_at", "updated_at"),
                "classes": ("collapse",),
            },
        ),
    )

    # Bulk actions for FSM transitions
    actions = [
        "make_featured",
        "remove_featured",
        "bulk_approve",
        "bulk_reject",
        "bulk_submit_for_review",
        "duplicate_property",
    ]

    def price_display(self, obj):
        return f"${obj.price:,.2f}"

    price_display.short_description = "Price (USD)"
    price_display.admin_order_field = "price"

    def agent_display(self, obj):
        """Display agent with verification badge and link."""
        if obj.agent:
            if obj.agent.is_verified_agent:
                return format_html(
                    '{} <span style="color: #22c55e;" title="Verified">✓</span>',
                    obj.agent.display_name
                )
            return obj.agent.display_name
        return "-"

    agent_display.short_description = "Agent"
    agent_display.admin_order_field = "agent__first_name"

    @admin.action(description="Marcar como destacado")
    def make_featured(self, request, queryset):
        updated = queryset.update(is_featured=True)
        self.message_user(request, f"{updated} propiedad(es) marcada(s) como destacada(s).")

    @admin.action(description="Quitar destacado")
    def remove_featured(self, request, queryset):
        updated = queryset.update(is_featured=False)
        self.message_user(request, f"{updated} propiedad(es) quitada(s) de destacadas.")

    @admin.action(description="Aprobar listados (En Revisión → Activa)")
    def bulk_approve(self, request, queryset):
        """Bulk approve pending review listings using FSM transitions."""
        approved = 0
        skipped = 0
        for prop in queryset.filter(status=PropertyStatus.PENDING_REVIEW):
            try:
                prop.approve(by_user=request.user)
                prop.save()
                approved += 1
            except Exception:
                skipped += 1

        self.message_user(
            request,
            f"{approved} propiedad(es) aprobada(s). {skipped} omitida(s) (no estaban en revisión)."
        )

    @admin.action(description="Rechazar listados (En Revisión → Rechazada)")
    def bulk_reject(self, request, queryset):
        """Bulk reject pending review listings using FSM transitions."""
        rejected = 0
        skipped = 0
        for prop in queryset.filter(status=PropertyStatus.PENDING_REVIEW):
            try:
                prop.reject(by_user=request.user, reason="Rechazado en revisión masiva. Contacte al administrador para más detalles.")
                prop.save()
                rejected += 1
            except Exception:
                skipped += 1

        self.message_user(
            request,
            f"{rejected} propiedad(es) rechazada(s). {skipped} omitida(s) (no estaban en revisión)."
        )

    @admin.action(description="Enviar a revisión (Borrador → En Revisión)")
    def bulk_submit_for_review(self, request, queryset):
        """Bulk submit drafts for review using FSM transitions."""
        submitted = 0
        skipped = 0
        for prop in queryset.filter(status__in=[PropertyStatus.DRAFT, PropertyStatus.REJECTED]):
            try:
                if prop.can_submit_for_review():
                    prop.submit_for_review()
                    prop.save()
                    submitted += 1
                else:
                    skipped += 1
            except Exception:
                skipped += 1

        self.message_user(
            request,
            f"{submitted} propiedad(es) enviada(s) a revisión. {skipped} omitida(s) (faltan datos requeridos)."
        )

    @admin.action(description="Duplicar propiedades")
    def duplicate_property(self, request, queryset):
        """Duplicate properties - useful for creating similar listings."""
        from django.db import transaction

        duplicated = 0
        for prop in queryset:
            with transaction.atomic():
                # Get all images from original property
                images = list(prop.images.all())

                # Create new property with reset fields
                new_prop = Property(
                    title=f"{prop.title} (Copia)",
                    description=prop.description,
                    description_es=prop.description_es,
                    property_type=prop.property_type,
                    listing_type=prop.listing_type,
                    # status will be DRAFT by default (FSM protected)
                    price=prop.price,
                    price_negotiable=prop.price_negotiable,
                    bedrooms=prop.bedrooms,
                    bathrooms=prop.bathrooms,
                    area_sqm=prop.area_sqm,
                    lot_size_sqm=prop.lot_size_sqm,
                    year_built=prop.year_built,
                    parking_spaces=prop.parking_spaces,
                    address=prop.address,
                    city=prop.city,
                    state=prop.state,
                    zip_code=prop.zip_code,
                    country=prop.country,
                    latitude=prop.latitude,
                    longitude=prop.longitude,
                    location=prop.location,
                    features=prop.features,
                    agent=prop.agent,
                    is_featured=False,
                    is_new_construction=prop.is_new_construction,
                    is_beachfront=prop.is_beachfront,
                    is_investment_opportunity=prop.is_investment_opportunity,
                )
                new_prop.save()

                # Duplicate images
                for img in images:
                    PropertyImage.objects.create(
                        property=new_prop,
                        image=img.image,
                        image_url=img.image_url,
                        caption=img.caption,
                        is_main=img.is_main,
                        order=img.order,
                    )

                duplicated += 1

        self.message_user(request, f"{duplicated} propiedad(es) duplicada(s) en estado Borrador.")


@admin.register(PropertyImage)
class PropertyImageAdmin(admin.ModelAdmin):
    """
    Admin for PropertyImage model.
    """

    list_display = ["id", "property", "image_preview", "caption", "is_main", "order"]
    list_filter = ["is_main", "created_at"]
    search_fields = ["property__title", "caption"]
    ordering = ["property", "order"]
    raw_id_fields = ["property"]

    def image_preview(self, obj):
        if obj.image:
            return format_html(
                '<img src="{}" style="max-height: 50px; max-width: 75px;" />',
                obj.image.url,
            )
        return "-"

    image_preview.short_description = "Preview"


@admin.register(SavedProperty)
class SavedPropertyAdmin(admin.ModelAdmin):
    """
    Admin for SavedProperty model.
    """

    list_display = ["user", "property", "created_at"]
    list_filter = ["created_at"]
    search_fields = ["user__email", "property__title"]
    ordering = ["-created_at"]
    raw_id_fields = ["user", "property"]
