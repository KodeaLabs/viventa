"""
Serializers for the Projects module.
"""

from rest_framework import serializers

from .models import (
    BuyerContract,
    PaymentScheduleItem,
    Project,
    ProjectImage,
    ProjectMilestone,
    ProjectUpdate,
    SellableAsset,
)


# ==================== Project Image ====================


class ProjectImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectImage
        fields = ["id", "image", "image_url", "caption", "order"]


# ==================== Project ====================


class ProjectListSerializer(serializers.ModelSerializer):
    location_display = serializers.CharField(read_only=True)
    progress_percentage = serializers.IntegerField(read_only=True)
    cover_image_url = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = [
            "id",
            "slug",
            "title",
            "title_es",
            "developer_name",
            "city",
            "state",
            "location_display",
            "status",
            "total_units",
            "available_units",
            "sold_units",
            "price_range_min",
            "price_range_max",
            "delivery_date",
            "cover_image_url",
            "progress_percentage",
            "is_featured",
            "created_at",
        ]

    def get_cover_image_url(self, obj):
        if obj.cover_image:
            request = self.context.get("request")
            if request:
                return request.build_absolute_uri(obj.cover_image.url)
            return obj.cover_image.url
        return None


class ProjectDetailSerializer(serializers.ModelSerializer):
    location_display = serializers.CharField(read_only=True)
    progress_percentage = serializers.IntegerField(read_only=True)
    gallery_images = ProjectImageSerializer(many=True, read_only=True)
    milestones = serializers.SerializerMethodField()
    available_assets_count = serializers.SerializerMethodField()
    cover_image_url = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = [
            "id",
            "slug",
            "title",
            "title_es",
            "description",
            "description_es",
            "developer_name",
            "developer_logo",
            "city",
            "state",
            "address",
            "latitude",
            "longitude",
            "location_display",
            "total_units",
            "available_units",
            "sold_units",
            "price_range_min",
            "price_range_max",
            "delivery_date",
            "construction_start_date",
            "amenities",
            "master_plan_url",
            "brochure_url",
            "video_url",
            "cover_image",
            "cover_image_url",
            "gallery_images",
            "status",
            "progress_percentage",
            "milestones",
            "available_assets_count",
            "is_featured",
            "created_at",
            "updated_at",
        ]

    def get_cover_image_url(self, obj):
        if obj.cover_image:
            request = self.context.get("request")
            if request:
                return request.build_absolute_uri(obj.cover_image.url)
            return obj.cover_image.url
        return None

    def get_milestones(self, obj):
        return ProjectMilestoneSerializer(obj.milestones.all(), many=True).data

    def get_available_assets_count(self, obj):
        return obj.assets.filter(status="available").count()


class ProjectCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = [
            "title",
            "title_es",
            "description",
            "description_es",
            "developer_name",
            "developer_logo",
            "city",
            "state",
            "address",
            "latitude",
            "longitude",
            "location",
            "total_units",
            "available_units",
            "sold_units",
            "price_range_min",
            "price_range_max",
            "delivery_date",
            "construction_start_date",
            "amenities",
            "master_plan_url",
            "brochure_url",
            "video_url",
            "cover_image",
            "is_featured",
        ]


# ==================== SellableAsset ====================


class SellableAssetListSerializer(serializers.ModelSerializer):
    class Meta:
        model = SellableAsset
        fields = [
            "id",
            "identifier",
            "asset_type",
            "floor",
            "area_sqm",
            "bedrooms",
            "bathrooms",
            "price_usd",
            "status",
            "floor_plan_url",
        ]


class SellableAssetDetailSerializer(serializers.ModelSerializer):
    project_title = serializers.CharField(source="project.title", read_only=True)
    project_slug = serializers.CharField(source="project.slug", read_only=True)

    class Meta:
        model = SellableAsset
        fields = [
            "id",
            "project",
            "project_title",
            "project_slug",
            "identifier",
            "asset_type",
            "floor",
            "area_sqm",
            "bedrooms",
            "bathrooms",
            "price_usd",
            "status",
            "floor_plan_url",
            "features",
            "created_at",
            "updated_at",
        ]


class SellableAssetCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = SellableAsset
        fields = [
            "identifier",
            "asset_type",
            "floor",
            "area_sqm",
            "bedrooms",
            "bathrooms",
            "price_usd",
            "floor_plan_url",
            "features",
        ]


# ==================== ProjectMilestone ====================


class ProjectMilestoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectMilestone
        fields = [
            "id",
            "title",
            "title_es",
            "description",
            "description_es",
            "target_date",
            "completed_date",
            "percentage",
            "status",
            "order",
        ]


class ProjectMilestoneCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectMilestone
        fields = [
            "title",
            "title_es",
            "description",
            "description_es",
            "target_date",
            "completed_date",
            "percentage",
            "status",
            "order",
        ]


# ==================== BuyerContract ====================


class PaymentScheduleItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentScheduleItem
        fields = [
            "id",
            "due_date",
            "amount_usd",
            "concept",
            "status",
            "paid_date",
            "payment_reference",
            "notes",
        ]


class PaymentScheduleItemCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentScheduleItem
        fields = [
            "due_date",
            "amount_usd",
            "concept",
            "status",
            "paid_date",
            "payment_reference",
            "notes",
        ]


class BuyerContractListSerializer(serializers.ModelSerializer):
    asset_identifier = serializers.CharField(
        source="asset.identifier", read_only=True
    )
    project_title = serializers.CharField(
        source="asset.project.title", read_only=True
    )
    project_slug = serializers.CharField(
        source="asset.project.slug", read_only=True
    )
    buyer_email = serializers.EmailField(source="buyer.email", read_only=True)
    buyer_name = serializers.CharField(source="buyer.full_name", read_only=True)

    class Meta:
        model = BuyerContract
        fields = [
            "id",
            "asset_identifier",
            "project_title",
            "project_slug",
            "buyer_email",
            "buyer_name",
            "contract_date",
            "total_price",
            "initial_payment",
            "payment_plan_months",
            "status",
            "created_at",
        ]


class BuyerContractDetailSerializer(serializers.ModelSerializer):
    asset = SellableAssetDetailSerializer(read_only=True)
    payments = PaymentScheduleItemSerializer(many=True, read_only=True)
    buyer_name = serializers.CharField(source="buyer.full_name", read_only=True)
    buyer_email = serializers.EmailField(source="buyer.email", read_only=True)

    class Meta:
        model = BuyerContract
        fields = [
            "id",
            "asset",
            "buyer_name",
            "buyer_email",
            "contract_date",
            "total_price",
            "initial_payment",
            "payment_plan_months",
            "status",
            "notes",
            "payments",
            "created_at",
            "updated_at",
        ]


class BuyerContractCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = BuyerContract
        fields = [
            "asset",
            "buyer",
            "contract_date",
            "total_price",
            "initial_payment",
            "payment_plan_months",
            "notes",
        ]


# ==================== ProjectUpdate ====================


class ProjectUpdateListSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source="author.full_name", read_only=True)

    class Meta:
        model = ProjectUpdate
        fields = [
            "id",
            "title",
            "title_es",
            "author_name",
            "image",
            "is_public",
            "published_at",
            "created_at",
        ]


class ProjectUpdateDetailSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source="author.full_name", read_only=True)

    class Meta:
        model = ProjectUpdate
        fields = [
            "id",
            "title",
            "title_es",
            "content",
            "content_es",
            "author_name",
            "image",
            "is_public",
            "published_at",
            "created_at",
            "updated_at",
        ]


class ProjectUpdateCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectUpdate
        fields = [
            "title",
            "title_es",
            "content",
            "content_es",
            "image",
            "is_public",
        ]
