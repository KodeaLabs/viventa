"""
Admin configuration for the inquiries app.
"""

from django.contrib import admin
from django.utils.html import format_html

from .models import Inquiry, InquiryNote


class InquiryNoteInline(admin.TabularInline):
    """
    Inline admin for inquiry notes.
    """

    model = InquiryNote
    extra = 1
    fields = ["content", "author", "created_at"]
    readonly_fields = ["created_at"]
    autocomplete_fields = ["author"]


@admin.register(Inquiry)
class InquiryAdmin(admin.ModelAdmin):
    """
    Admin for Inquiry model.
    """

    list_display = [
        "id_short",
        "full_name",
        "email",
        "property_link",
        "status_badge",
        "preferred_contact_method",
        "country",
        "created_at",
    ]
    list_filter = [
        "status",
        "preferred_contact_method",
        "preferred_language",
        "country",
        "created_at",
    ]
    search_fields = [
        "full_name",
        "email",
        "phone",
        "message",
        "property_listing__title",
        "property_listing__agent__email",
    ]
    ordering = ["-created_at"]
    readonly_fields = [
        "ip_address",
        "user_agent",
        "referrer",
        "created_at",
        "updated_at",
    ]
    raw_id_fields = ["property_listing", "user"]
    inlines = [InquiryNoteInline]

    fieldsets = (
        (
            "Contact Information",
            {
                "fields": (
                    "full_name",
                    "email",
                    "phone",
                    "country",
                    "preferred_contact_method",
                    "preferred_language",
                ),
            },
        ),
        (
            "Inquiry Details",
            {
                "fields": ("property_listing", "message", "budget_min", "budget_max"),
            },
        ),
        (
            "Status & Notes",
            {
                "fields": ("status", "internal_notes"),
            },
        ),
        (
            "User & Tracking",
            {
                "fields": ("user", "ip_address", "user_agent", "referrer"),
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

    actions = ["mark_as_contacted", "mark_as_spam", "mark_as_closed"]

    def id_short(self, obj):
        return str(obj.id)[:8]

    id_short.short_description = "ID"

    def property_link(self, obj):
        return format_html(
            '<a href="/admin/properties/property/{}/change/">{}</a>',
            obj.property_listing.id,
            obj.property_listing.title[:30] + "..." if len(obj.property_listing.title) > 30 else obj.property_listing.title,
        )

    property_link.short_description = "Property"

    def status_badge(self, obj):
        colors = {
            "new": "#3b82f6",
            "contacted": "#8b5cf6",
            "in_progress": "#f59e0b",
            "qualified": "#10b981",
            "closed": "#6b7280",
            "spam": "#ef4444",
        }
        color = colors.get(obj.status, "#6b7280")
        return format_html(
            '<span style="background-color: {}; color: white; padding: 2px 8px; '
            'border-radius: 4px; font-size: 11px;">{}</span>',
            color,
            obj.get_status_display(),
        )

    status_badge.short_description = "Status"

    @admin.action(description="Mark as Contacted")
    def mark_as_contacted(self, request, queryset):
        updated = queryset.update(status="contacted")
        self.message_user(request, f"{updated} inquiry(ies) marked as contacted.")

    @admin.action(description="Mark as Spam")
    def mark_as_spam(self, request, queryset):
        updated = queryset.update(status="spam")
        self.message_user(request, f"{updated} inquiry(ies) marked as spam.")

    @admin.action(description="Mark as Closed")
    def mark_as_closed(self, request, queryset):
        updated = queryset.update(status="closed")
        self.message_user(request, f"{updated} inquiry(ies) closed.")


@admin.register(InquiryNote)
class InquiryNoteAdmin(admin.ModelAdmin):
    """
    Admin for InquiryNote model.
    """

    list_display = ["id", "inquiry", "author", "content_preview", "created_at"]
    list_filter = ["created_at"]
    search_fields = ["content", "inquiry__full_name", "author__email"]
    ordering = ["-created_at"]
    raw_id_fields = ["inquiry", "author"]

    def content_preview(self, obj):
        return obj.content[:50] + "..." if len(obj.content) > 50 else obj.content

    content_preview.short_description = "Content"
