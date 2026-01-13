"""
Admin configuration for common app.
"""

from django.contrib import admin

from .models import Location


@admin.register(Location)
class LocationAdmin(admin.ModelAdmin):
    """Admin for Location model."""

    list_display = [
        "name",
        "location_type",
        "state",
        "is_featured",
        "is_active",
        "display_order",
    ]
    list_filter = ["location_type", "state", "is_featured", "is_active"]
    search_fields = ["name", "name_es", "state"]
    prepopulated_fields = {"slug": ("name",)}
    ordering = ["display_order", "name"]

    fieldsets = (
        (None, {
            "fields": ("name", "name_es", "slug", "location_type", "state", "parent")
        }),
        ("Coordinates", {
            "fields": ("latitude", "longitude"),
            "classes": ("collapse",),
        }),
        ("Display", {
            "fields": ("description", "description_es", "image_url", "is_featured", "display_order", "is_active")
        }),
    )
