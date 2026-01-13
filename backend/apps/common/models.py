"""
Base models for the application.
"""

import uuid

from django.db import models


class TimeStampedModel(models.Model):
    """
    Abstract base model with created and updated timestamps.
    """

    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class UUIDModel(models.Model):
    """
    Abstract base model with UUID primary key.
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    class Meta:
        abstract = True


class BaseModel(UUIDModel, TimeStampedModel):
    """
    Abstract base model combining UUID and timestamps.
    """

    class Meta:
        abstract = True


class LocationType(models.TextChoices):
    """Types of locations."""
    ISLAND = "island", "Isla"
    CITY = "city", "Ciudad"
    REGION = "region", "Región"
    BEACH = "beach", "Playa"
    MOUNTAIN = "mountain", "Montaña"


class Location(BaseModel):
    """
    Custom locations for Venezuela (Margarita, Coche, Los Roques, etc.)
    These are marketing/destination-focused locations, not administrative divisions.
    """
    name = models.CharField(max_length=100, unique=True)
    name_es = models.CharField(max_length=100, blank=True, help_text="Spanish name if different")
    slug = models.SlugField(max_length=120, unique=True, db_index=True)
    location_type = models.CharField(
        max_length=20,
        choices=LocationType.choices,
        default=LocationType.CITY,
    )

    # Parent location (e.g., Margarita -> Nueva Esparta)
    parent = models.ForeignKey(
        "self",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="children",
        help_text="Parent location (e.g., state for a city)",
    )

    # The actual state this location belongs to
    state = models.CharField(max_length=100, help_text="Venezuelan state (e.g., Nueva Esparta)")

    # Coordinates for map centering
    latitude = models.DecimalField(max_digits=10, decimal_places=8, null=True, blank=True)
    longitude = models.DecimalField(max_digits=11, decimal_places=8, null=True, blank=True)

    # Display settings
    description = models.TextField(blank=True)
    description_es = models.TextField(blank=True)
    image_url = models.URLField(blank=True, help_text="Representative image for this location")

    # Ordering and visibility
    is_featured = models.BooleanField(default=False, help_text="Show in featured locations")
    display_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name = "Location"
        verbose_name_plural = "Locations"
        ordering = ["display_order", "name"]

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            from apps.common.utils import generate_unique_slug
            self.slug = generate_unique_slug(Location, self.name)
        if not self.name_es:
            self.name_es = self.name
        super().save(*args, **kwargs)

    @property
    def display_name(self):
        """Return name with state for clarity."""
        return f"{self.name}, {self.state}"
