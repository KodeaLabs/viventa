"""
Filter classes for the Projects module.
"""

from django.db import models as django_models
from django_filters import rest_framework as filters

from .models import (
    AssetStatus,
    AssetType,
    BuyerContract,
    ContractStatus,
    PaymentConcept,
    PaymentScheduleItem,
    PaymentStatus,
    Project,
    ProjectStatus,
    SellableAsset,
)


class ProjectFilter(filters.FilterSet):
    min_price = filters.NumberFilter(field_name="price_range_min", lookup_expr="gte")
    max_price = filters.NumberFilter(field_name="price_range_max", lookup_expr="lte")
    city = filters.CharFilter(lookup_expr="iexact")
    state = filters.CharFilter(lookup_expr="iexact")
    status = filters.ChoiceFilter(choices=ProjectStatus.choices)
    is_featured = filters.BooleanFilter()
    search = filters.CharFilter(method="filter_search")

    class Meta:
        model = Project
        fields = ["status", "city", "state", "is_featured"]

    def filter_search(self, queryset, name, value):
        return queryset.filter(
            django_models.Q(title__icontains=value)
            | django_models.Q(title_es__icontains=value)
            | django_models.Q(description__icontains=value)
            | django_models.Q(developer_name__icontains=value)
            | django_models.Q(city__icontains=value)
        )


class SellableAssetFilter(filters.FilterSet):
    asset_type = filters.ChoiceFilter(choices=AssetType.choices)
    status = filters.ChoiceFilter(choices=AssetStatus.choices)
    min_price = filters.NumberFilter(field_name="price_usd", lookup_expr="gte")
    max_price = filters.NumberFilter(field_name="price_usd", lookup_expr="lte")
    min_area = filters.NumberFilter(field_name="area_sqm", lookup_expr="gte")
    max_area = filters.NumberFilter(field_name="area_sqm", lookup_expr="lte")
    min_bedrooms = filters.NumberFilter(field_name="bedrooms", lookup_expr="gte")
    floor = filters.NumberFilter()

    class Meta:
        model = SellableAsset
        fields = ["asset_type", "status", "floor"]


class BuyerContractFilter(filters.FilterSet):
    status = filters.ChoiceFilter(choices=ContractStatus.choices)
    buyer = filters.UUIDFilter(field_name="buyer__id")

    class Meta:
        model = BuyerContract
        fields = ["status"]


class PaymentScheduleFilter(filters.FilterSet):
    status = filters.ChoiceFilter(choices=PaymentStatus.choices)
    concept = filters.ChoiceFilter(choices=PaymentConcept.choices)
    due_after = filters.DateFilter(field_name="due_date", lookup_expr="gte")
    due_before = filters.DateFilter(field_name="due_date", lookup_expr="lte")

    class Meta:
        model = PaymentScheduleItem
        fields = ["status", "concept"]
