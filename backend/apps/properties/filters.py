"""
Filters for the properties app.
"""

from django_filters import rest_framework as filters

from .models import Property, PropertyStatus, PropertyType, ListingType


class PropertyFilter(filters.FilterSet):
    """
    Filter set for property listings.
    """

    # Price range
    min_price = filters.NumberFilter(field_name="price", lookup_expr="gte")
    max_price = filters.NumberFilter(field_name="price", lookup_expr="lte")

    # Area range
    min_area = filters.NumberFilter(field_name="area_sqm", lookup_expr="gte")
    max_area = filters.NumberFilter(field_name="area_sqm", lookup_expr="lte")

    # Bedrooms
    min_bedrooms = filters.NumberFilter(field_name="bedrooms", lookup_expr="gte")
    max_bedrooms = filters.NumberFilter(field_name="bedrooms", lookup_expr="lte")

    # Bathrooms
    min_bathrooms = filters.NumberFilter(field_name="bathrooms", lookup_expr="gte")

    # Location
    city = filters.CharFilter(lookup_expr="iexact")
    state = filters.CharFilter(lookup_expr="iexact")

    # Types
    property_type = filters.ChoiceFilter(choices=PropertyType.choices)
    listing_type = filters.ChoiceFilter(choices=ListingType.choices)

    # Flags
    is_featured = filters.BooleanFilter()
    is_beachfront = filters.BooleanFilter()
    is_new_construction = filters.BooleanFilter()
    is_investment_opportunity = filters.BooleanFilter()

    # Search
    search = filters.CharFilter(method="filter_search")

    class Meta:
        model = Property
        fields = [
            "property_type",
            "listing_type",
            "status",
            "city",
            "state",
            "is_featured",
            "is_beachfront",
            "is_new_construction",
            "is_investment_opportunity",
        ]

    def filter_search(self, queryset, name, value):
        """
        Full-text search across title, description, address, and city.
        """
        return queryset.filter(
            models.Q(title__icontains=value)
            | models.Q(description__icontains=value)
            | models.Q(address__icontains=value)
            | models.Q(city__icontains=value)
        )


# Import models for Q objects
from django.db import models
