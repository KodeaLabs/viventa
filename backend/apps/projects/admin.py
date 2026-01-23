"""
Django admin configuration for the Projects module.
"""

from django.contrib import admin

from .models import (
    BuyerContract,
    PaymentScheduleItem,
    Project,
    ProjectImage,
    ProjectMilestone,
    ProjectStatus,
    ProjectUpdate,
    SellableAsset,
)


# ==================== Inlines ====================


class ProjectImageInline(admin.TabularInline):
    model = ProjectImage
    extra = 1
    fields = ["image", "image_url", "caption", "order"]


class SellableAssetInline(admin.TabularInline):
    model = SellableAsset
    extra = 0
    fields = [
        "identifier",
        "asset_type",
        "floor",
        "area_sqm",
        "bedrooms",
        "bathrooms",
        "price_usd",
        "status",
    ]
    readonly_fields = ["status"]


class ProjectMilestoneInline(admin.TabularInline):
    model = ProjectMilestone
    extra = 0
    fields = ["title", "target_date", "completed_date", "status", "percentage", "order"]


class PaymentScheduleItemInline(admin.TabularInline):
    model = PaymentScheduleItem
    extra = 0
    fields = [
        "due_date",
        "amount_usd",
        "concept",
        "status",
        "paid_date",
        "payment_reference",
    ]


# ==================== Admin Classes ====================


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = [
        "title",
        "developer_name",
        "city",
        "status",
        "total_units",
        "available_units",
        "is_featured",
        "created_at",
    ]
    list_filter = ["status", "city", "state", "is_featured", "created_at"]
    search_fields = ["title", "developer_name", "city", "description"]
    ordering = ["-created_at"]
    readonly_fields = ["slug", "status", "created_at", "updated_at"]
    inlines = [ProjectImageInline, SellableAssetInline, ProjectMilestoneInline]
    fieldsets = (
        (
            "Basic Information",
            {"fields": ("title", "title_es", "slug", "description", "description_es")},
        ),
        ("Developer", {"fields": ("developer_name", "developer_logo")}),
        (
            "Location",
            {"fields": ("city", "state", "address", "latitude", "longitude", "location")},
        ),
        (
            "Units & Pricing",
            {
                "fields": (
                    "total_units",
                    "sold_units",
                    "available_units",
                    "price_range_min",
                    "price_range_max",
                )
            },
        ),
        ("Dates", {"fields": ("delivery_date", "construction_start_date")}),
        ("Status & Management", {"fields": ("status", "manager", "is_featured")}),
        (
            "Media & Links",
            {
                "fields": (
                    "cover_image",
                    "master_plan_url",
                    "brochure_url",
                    "video_url",
                    "amenities",
                )
            },
        ),
        (
            "Timestamps",
            {"fields": ("created_at", "updated_at"), "classes": ("collapse",)},
        ),
    )
    actions = ["bulk_start_presale", "bulk_mark_featured", "bulk_remove_featured"]

    @admin.action(description="Start Pre-sale for selected projects")
    def bulk_start_presale(self, request, queryset):
        count = 0
        for project in queryset.filter(status=ProjectStatus.DRAFT):
            try:
                project.start_presale()
                project.save()
                count += 1
            except Exception:
                pass
        self.message_user(request, f"{count} project(s) moved to Pre-sale.")

    @admin.action(description="Mark as Featured")
    def bulk_mark_featured(self, request, queryset):
        updated = queryset.update(is_featured=True)
        self.message_user(request, f"{updated} project(s) marked as featured.")

    @admin.action(description="Remove Featured status")
    def bulk_remove_featured(self, request, queryset):
        updated = queryset.update(is_featured=False)
        self.message_user(request, f"{updated} project(s) unfeatured.")


@admin.register(SellableAsset)
class SellableAssetAdmin(admin.ModelAdmin):
    list_display = ["identifier", "project", "asset_type", "price_usd", "status"]
    list_filter = ["asset_type", "status", "project"]
    search_fields = ["identifier", "project__title"]
    readonly_fields = ["status"]


@admin.register(ProjectMilestone)
class ProjectMilestoneAdmin(admin.ModelAdmin):
    list_display = ["title", "project", "status", "target_date", "percentage", "order"]
    list_filter = ["status", "project"]
    search_fields = ["title", "project__title"]


@admin.register(BuyerContract)
class BuyerContractAdmin(admin.ModelAdmin):
    list_display = [
        "buyer",
        "asset",
        "total_price",
        "status",
        "contract_date",
        "created_at",
    ]
    list_filter = ["status", "contract_date"]
    search_fields = ["buyer__email", "buyer__first_name", "asset__identifier"]
    readonly_fields = ["status"]
    raw_id_fields = ["buyer", "asset"]
    inlines = [PaymentScheduleItemInline]


@admin.register(PaymentScheduleItem)
class PaymentScheduleItemAdmin(admin.ModelAdmin):
    list_display = ["contract", "due_date", "amount_usd", "concept", "status"]
    list_filter = ["status", "concept", "due_date"]
    search_fields = ["contract__buyer__email", "payment_reference"]


@admin.register(ProjectUpdate)
class ProjectUpdateAdmin(admin.ModelAdmin):
    list_display = ["title", "project", "author", "is_public", "published_at"]
    list_filter = ["is_public", "project", "published_at"]
    search_fields = ["title", "content", "project__title"]
    raw_id_fields = ["author"]
