"""
Views for the Projects module.
"""

from django_filters.rest_framework import DjangoFilterBackend
from django_fsm import can_proceed
from rest_framework import filters, permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from apps.common.pagination import StandardResultsPagination

from .filters import (
    BuyerContractFilter,
    PaymentScheduleFilter,
    ProjectFilter,
    SellableAssetFilter,
)
from .models import (
    AssetStatus,
    BuyerContract,
    PaymentScheduleItem,
    Project,
    ProjectImage,
    ProjectMilestone,
    ProjectStatus,
    ProjectUpdate,
    SellableAsset,
)
from .permissions import IsBuyerOfContract, IsProjectAdmin, IsProjectManager
from .serializers import (
    BuyerContractCreateUpdateSerializer,
    BuyerContractDetailSerializer,
    BuyerContractListSerializer,
    PaymentScheduleItemCreateUpdateSerializer,
    PaymentScheduleItemSerializer,
    ProjectCreateUpdateSerializer,
    ProjectDetailSerializer,
    ProjectImageSerializer,
    ProjectListSerializer,
    ProjectMilestoneCreateUpdateSerializer,
    ProjectMilestoneSerializer,
    ProjectUpdateCreateUpdateSerializer,
    ProjectUpdateDetailSerializer,
    ProjectUpdateListSerializer,
    SellableAssetCreateUpdateSerializer,
    SellableAssetDetailSerializer,
    SellableAssetListSerializer,
)


# ======================== PUBLIC VIEWS ========================


class PublicProjectViewSet(viewsets.ReadOnlyModelViewSet):
    """Public viewset for browsing active projects."""

    pagination_class = StandardResultsPagination
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]
    filterset_class = ProjectFilter
    search_fields = ["title", "title_es", "description", "developer_name", "city"]
    ordering_fields = [
        "price_range_min",
        "created_at",
        "delivery_date",
        "total_units",
    ]
    ordering = ["-created_at"]
    lookup_field = "slug"

    def get_queryset(self):
        return Project.objects.exclude(
            status=ProjectStatus.DRAFT
        ).prefetch_related("gallery_images", "milestones")

    def get_serializer_class(self):
        if self.action == "retrieve":
            return ProjectDetailSerializer
        return ProjectListSerializer

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response({"success": True, "data": serializer.data})

    @action(detail=True, methods=["get"])
    def assets(self, request, slug=None):
        """List available assets for a project."""
        project = self.get_object()
        assets = project.assets.filter(status=AssetStatus.AVAILABLE)
        filterset = SellableAssetFilter(request.query_params, queryset=assets)
        page = self.paginate_queryset(filterset.qs)
        if page is not None:
            serializer = SellableAssetListSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = SellableAssetListSerializer(filterset.qs, many=True)
        return Response({"success": True, "data": serializer.data})

    @action(detail=True, methods=["get"])
    def updates(self, request, slug=None):
        """List public updates for a project."""
        project = self.get_object()
        updates = project.updates.filter(is_public=True)
        page = self.paginate_queryset(updates)
        if page is not None:
            serializer = ProjectUpdateListSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = ProjectUpdateListSerializer(updates, many=True)
        return Response({"success": True, "data": serializer.data})

    @action(detail=False, methods=["get"])
    def featured(self, request):
        """List featured projects."""
        projects = self.get_queryset().filter(is_featured=True)[:6]
        serializer = ProjectListSerializer(
            projects, many=True, context={"request": request}
        )
        return Response({"success": True, "data": serializer.data})


# ======================== PROJECT ADMIN VIEWS ========================


class AdminProjectViewSet(viewsets.ModelViewSet):
    """ViewSet for Project Admins to manage their projects."""

    permission_classes = [IsProjectAdmin]
    pagination_class = StandardResultsPagination

    def get_queryset(self):
        if self.request.user.is_staff:
            return Project.objects.all()
        return Project.objects.filter(manager=self.request.user)

    def get_serializer_class(self):
        if self.action in ["create", "update", "partial_update"]:
            return ProjectCreateUpdateSerializer
        if self.action == "retrieve":
            return ProjectDetailSerializer
        return ProjectListSerializer

    def perform_create(self, serializer):
        serializer.save(manager=self.request.user)

    def _do_transition(self, obj, transition_name):
        transition_method = getattr(obj, transition_name)
        if not can_proceed(transition_method):
            return Response(
                {
                    "success": False,
                    "error": {
                        "message": f"Transition '{transition_name}' not allowed from current state '{obj.status}'."
                    },
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        transition_method()
        obj.save()
        return Response({"success": True, "data": {"status": obj.status}})

    @action(detail=True, methods=["post"])
    def start_presale(self, request, pk=None):
        return self._do_transition(self.get_object(), "start_presale")

    @action(detail=True, methods=["post"])
    def start_construction(self, request, pk=None):
        return self._do_transition(self.get_object(), "start_construction")

    @action(detail=True, methods=["post"])
    def mark_delivered(self, request, pk=None):
        return self._do_transition(self.get_object(), "mark_delivered")

    @action(detail=True, methods=["post"])
    def cancel_project(self, request, pk=None):
        return self._do_transition(self.get_object(), "cancel")


class AdminAssetViewSet(viewsets.ModelViewSet):
    """ViewSet for managing assets within a project."""

    permission_classes = [IsProjectAdmin]
    pagination_class = StandardResultsPagination
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_class = SellableAssetFilter
    ordering = ["asset_type", "identifier"]

    def get_queryset(self):
        project_id = self.kwargs.get("project_pk")
        qs = SellableAsset.objects.filter(project_id=project_id)
        if not self.request.user.is_staff:
            qs = qs.filter(project__manager=self.request.user)
        return qs

    def get_serializer_class(self):
        if self.action in ["create", "update", "partial_update"]:
            return SellableAssetCreateUpdateSerializer
        if self.action == "retrieve":
            return SellableAssetDetailSerializer
        return SellableAssetListSerializer

    def perform_create(self, serializer):
        project = Project.objects.get(pk=self.kwargs["project_pk"])
        serializer.save(project=project)

    def _do_asset_transition(self, obj, transition_name):
        transition_method = getattr(obj, transition_name)
        if not can_proceed(transition_method):
            return Response(
                {
                    "success": False,
                    "error": {
                        "message": f"Transition '{transition_name}' not allowed from state '{obj.status}'."
                    },
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        transition_method()
        obj.save()
        return Response({"success": True, "data": {"status": obj.status}})

    @action(detail=True, methods=["post"])
    def reserve(self, request, project_pk=None, pk=None):
        return self._do_asset_transition(self.get_object(), "reserve")

    @action(detail=True, methods=["post"])
    def mark_sold(self, request, project_pk=None, pk=None):
        return self._do_asset_transition(self.get_object(), "mark_sold")

    @action(detail=True, methods=["post"])
    def deliver(self, request, project_pk=None, pk=None):
        return self._do_asset_transition(self.get_object(), "deliver")

    @action(detail=True, methods=["post"])
    def release(self, request, project_pk=None, pk=None):
        return self._do_asset_transition(self.get_object(), "release")


class AdminMilestoneViewSet(viewsets.ModelViewSet):
    """ViewSet for managing milestones within a project."""

    permission_classes = [IsProjectAdmin]

    def get_queryset(self):
        project_id = self.kwargs.get("project_pk")
        qs = ProjectMilestone.objects.filter(project_id=project_id)
        if not self.request.user.is_staff:
            qs = qs.filter(project__manager=self.request.user)
        return qs

    def get_serializer_class(self):
        if self.action in ["create", "update", "partial_update"]:
            return ProjectMilestoneCreateUpdateSerializer
        return ProjectMilestoneSerializer

    def perform_create(self, serializer):
        project = Project.objects.get(pk=self.kwargs["project_pk"])
        serializer.save(project=project)


class AdminContractViewSet(viewsets.ModelViewSet):
    """ViewSet for managing buyer contracts within a project."""

    permission_classes = [IsProjectAdmin]
    pagination_class = StandardResultsPagination
    filter_backends = [DjangoFilterBackend]
    filterset_class = BuyerContractFilter

    def get_queryset(self):
        project_id = self.kwargs.get("project_pk")
        qs = BuyerContract.objects.filter(
            asset__project_id=project_id
        ).select_related("asset", "buyer", "asset__project")
        if not self.request.user.is_staff:
            qs = qs.filter(asset__project__manager=self.request.user)
        return qs

    def get_serializer_class(self):
        if self.action in ["create", "update", "partial_update"]:
            return BuyerContractCreateUpdateSerializer
        if self.action == "retrieve":
            return BuyerContractDetailSerializer
        return BuyerContractListSerializer

    def _do_contract_transition(self, obj, transition_name):
        transition_method = getattr(obj, transition_name)
        if not can_proceed(transition_method):
            return Response(
                {
                    "success": False,
                    "error": {
                        "message": f"Contract transition '{transition_name}' not allowed from state '{obj.status}'."
                    },
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        transition_method()
        obj.save()
        # Release asset when contract is cancelled
        if transition_name == "cancel" and can_proceed(obj.asset.release):
            obj.asset.release()
            obj.asset.save()
        return Response({"success": True, "data": {"status": obj.status}})

    @action(detail=True, methods=["post"])
    def sign(self, request, project_pk=None, pk=None):
        return self._do_contract_transition(self.get_object(), "sign")

    @action(detail=True, methods=["post"])
    def activate(self, request, project_pk=None, pk=None):
        return self._do_contract_transition(self.get_object(), "activate")

    @action(detail=True, methods=["post"])
    def complete(self, request, project_pk=None, pk=None):
        return self._do_contract_transition(self.get_object(), "complete")

    @action(detail=True, methods=["post"])
    def cancel_contract(self, request, project_pk=None, pk=None):
        return self._do_contract_transition(self.get_object(), "cancel")


class AdminPaymentViewSet(viewsets.ModelViewSet):
    """ViewSet for managing payments within a contract."""

    permission_classes = [IsProjectAdmin]
    filter_backends = [DjangoFilterBackend]
    filterset_class = PaymentScheduleFilter

    def get_queryset(self):
        contract_id = self.kwargs.get("contract_pk")
        qs = PaymentScheduleItem.objects.filter(contract_id=contract_id)
        if not self.request.user.is_staff:
            qs = qs.filter(contract__asset__project__manager=self.request.user)
        return qs

    def get_serializer_class(self):
        if self.action in ["create", "update", "partial_update"]:
            return PaymentScheduleItemCreateUpdateSerializer
        return PaymentScheduleItemSerializer

    def perform_create(self, serializer):
        contract = BuyerContract.objects.get(pk=self.kwargs["contract_pk"])
        serializer.save(contract=contract)


class AdminProjectUpdateViewSet(viewsets.ModelViewSet):
    """ViewSet for managing project updates."""

    permission_classes = [IsProjectAdmin]

    def get_queryset(self):
        project_id = self.kwargs.get("project_pk")
        qs = ProjectUpdate.objects.filter(project_id=project_id)
        if not self.request.user.is_staff:
            qs = qs.filter(project__manager=self.request.user)
        return qs

    def get_serializer_class(self):
        if self.action in ["create", "update", "partial_update"]:
            return ProjectUpdateCreateUpdateSerializer
        if self.action == "retrieve":
            return ProjectUpdateDetailSerializer
        return ProjectUpdateListSerializer

    def perform_create(self, serializer):
        project = Project.objects.get(pk=self.kwargs["project_pk"])
        serializer.save(project=project, author=self.request.user)


# ======================== BUYER VIEWS ========================


class BuyerContractViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for buyers to view their contracts."""

    permission_classes = [permissions.IsAuthenticated]
    pagination_class = StandardResultsPagination

    def get_queryset(self):
        return BuyerContract.objects.filter(
            buyer=self.request.user
        ).select_related("asset", "asset__project")

    def get_serializer_class(self):
        if self.action == "retrieve":
            return BuyerContractDetailSerializer
        return BuyerContractListSerializer

    @action(detail=True, methods=["get"])
    def payments(self, request, pk=None):
        contract = self.get_object()
        payments = contract.payments.all()
        serializer = PaymentScheduleItemSerializer(payments, many=True)
        return Response({"success": True, "data": serializer.data})
