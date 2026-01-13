"""
Property models for the real estate platform.
"""

from decimal import Decimal

from django.conf import settings
from django.core.validators import MinValueValidator
from django.db import models
from django.utils import timezone
from django_fsm import FSMField, transition
from imagekit.models import ImageSpecField
from imagekit.processors import ResizeToFill, ResizeToFit

from apps.common.models import BaseModel
from apps.common.utils import generate_unique_slug


class PropertyType(models.TextChoices):
    """Types of properties - vacation/luxury focused."""

    BEACH_APARTMENT = "beach_apartment", "Beach Apartment"
    APARTMENT = "apartment", "Apartment"
    HOUSE = "house", "House"
    VILLA = "villa", "Villa"
    PENTHOUSE = "penthouse", "Penthouse"
    FINCA = "finca", "Finca / Country Estate"
    TOWNHOUSE = "townhouse", "Townhouse"
    BEACH_HOUSE = "beach_house", "Beach House"
    LAND = "land", "Land"
    COMMERCIAL = "commercial", "Commercial"


class PropertyStatus(models.TextChoices):
    """Status of a property listing."""

    DRAFT = "draft", "Borrador"  # Agent is still editing
    PENDING_REVIEW = "pending_review", "En Revisión"  # Submitted, waiting for admin approval
    ACTIVE = "active", "Activa"  # Approved and visible to public
    REJECTED = "rejected", "Rechazada"  # Admin rejected, needs changes
    INACTIVE = "inactive", "Desactivada"  # Agent disabled the listing
    SOLD = "sold", "Vendida"  # Property was sold
    RENTED = "rented", "Alquilada"  # Property was rented


class ListingType(models.TextChoices):
    """Type of listing."""

    SALE = "sale", "For Sale"
    RENT = "rent", "For Rent"


class Property(BaseModel):
    """
    Main property model representing a real estate listing.
    """

    # Basic Information
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=300, unique=True, db_index=True)
    description = models.TextField()
    description_es = models.TextField(blank=True, help_text="Spanish description")

    # Property Details
    property_type = models.CharField(
        max_length=20, choices=PropertyType.choices, default=PropertyType.HOUSE
    )
    listing_type = models.CharField(
        max_length=10, choices=ListingType.choices, default=ListingType.SALE
    )
    status = FSMField(
        max_length=20,
        choices=PropertyStatus.choices,
        default=PropertyStatus.DRAFT,
        protected=True,  # Prevents direct assignment, must use transitions
    )

    # Pricing
    price = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        validators=[MinValueValidator(Decimal("0.01"))],
        help_text="Price in USD",
    )
    price_negotiable = models.BooleanField(default=False)

    # Size and Features
    bedrooms = models.PositiveIntegerField(default=0)
    bathrooms = models.DecimalField(max_digits=3, decimal_places=1, default=0)
    area_sqm = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="Area in square meters",
    )
    lot_size_sqm = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="Lot size in square meters",
    )
    year_built = models.PositiveIntegerField(null=True, blank=True)
    parking_spaces = models.PositiveIntegerField(default=0)

    # Location
    address = models.CharField(max_length=255)
    city = models.CharField(max_length=100, db_index=True)
    state = models.CharField(max_length=100, db_index=True)
    zip_code = models.CharField(max_length=20, blank=True)
    country = models.CharField(max_length=100, default="Venezuela")
    latitude = models.DecimalField(
        max_digits=10, decimal_places=8, null=True, blank=True
    )
    longitude = models.DecimalField(
        max_digits=11, decimal_places=8, null=True, blank=True
    )

    # Custom location (Margarita, Los Roques, etc.)
    location = models.ForeignKey(
        "common.Location",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="properties",
        help_text="Custom location/destination for this property",
    )

    # Features and Amenities
    features = models.JSONField(
        default=list,
        blank=True,
        help_text="List of features like pool, garden, etc.",
    )

    # Relationships
    agent = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="properties",
    )

    # Flags
    is_featured = models.BooleanField(default=False, db_index=True)
    is_new_construction = models.BooleanField(default=False)
    is_beachfront = models.BooleanField(default=False)
    is_investment_opportunity = models.BooleanField(default=False)

    # Stats
    view_count = models.PositiveIntegerField(default=0)

    # Approval workflow
    submitted_at = models.DateTimeField(
        null=True, blank=True,
        help_text="When the agent submitted for review"
    )
    reviewed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="reviewed_properties",
        help_text="Admin who reviewed this listing"
    )
    reviewed_at = models.DateTimeField(
        null=True, blank=True,
        help_text="When the listing was reviewed"
    )
    rejection_reason = models.TextField(
        blank=True,
        help_text="Reason for rejection (if rejected)"
    )
    admin_notes = models.TextField(
        blank=True,
        help_text="Internal notes for admins"
    )

    class Meta:
        verbose_name = "Property"
        verbose_name_plural = "Properties"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["status", "listing_type"]),
            models.Index(fields=["price"]),
            models.Index(fields=["city", "state"]),
            models.Index(fields=["property_type"]),
        ]
        permissions = [
            ("can_approve_property", "Can approve/reject property listings"),
        ]

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = generate_unique_slug(Property, self.title)
        super().save(*args, **kwargs)

    @property
    def main_image(self):
        """Return the main/first image of the property."""
        return self.images.filter(is_main=True).first() or self.images.first()

    @property
    def location_display(self) -> str:
        """Return formatted location string."""
        return f"{self.city}, {self.state}"

    # ==================== FSM Transitions ====================

    def can_submit_for_review(self):
        """Check if property can be submitted for review."""
        # Must have at least a title, description, price, and one image
        return bool(
            self.title
            and self.description
            and self.price
            and self.images.exists()
        )

    @transition(
        field=status,
        source=[PropertyStatus.DRAFT, PropertyStatus.REJECTED],
        target=PropertyStatus.PENDING_REVIEW,
        conditions=[can_submit_for_review],
    )
    def submit_for_review(self):
        """Agent submits property for admin review."""
        self.submitted_at = timezone.now()
        self.rejection_reason = ""  # Clear previous rejection

    @transition(
        field=status,
        source=PropertyStatus.PENDING_REVIEW,
        target=PropertyStatus.ACTIVE,
        permission="properties.can_approve_property",
    )
    def approve(self, by_user=None):
        """Admin approves the property listing."""
        self.reviewed_at = timezone.now()
        self.reviewed_by = by_user
        self.rejection_reason = ""

    @transition(
        field=status,
        source=PropertyStatus.PENDING_REVIEW,
        target=PropertyStatus.REJECTED,
        permission="properties.can_approve_property",
    )
    def reject(self, by_user=None, reason=""):
        """Admin rejects the property listing."""
        self.reviewed_at = timezone.now()
        self.reviewed_by = by_user
        self.rejection_reason = reason

    @transition(
        field=status,
        source=PropertyStatus.ACTIVE,
        target=PropertyStatus.INACTIVE,
    )
    def deactivate(self):
        """Agent or admin deactivates an active listing."""
        pass

    @transition(
        field=status,
        source=PropertyStatus.INACTIVE,
        target=PropertyStatus.PENDING_REVIEW,
    )
    def reactivate(self):
        """Agent reactivates a listing - goes back to review."""
        self.submitted_at = timezone.now()

    @transition(
        field=status,
        source=PropertyStatus.ACTIVE,
        target=PropertyStatus.SOLD,
    )
    def mark_as_sold(self):
        """Mark property as sold."""
        pass

    @transition(
        field=status,
        source=PropertyStatus.ACTIVE,
        target=PropertyStatus.RENTED,
    )
    def mark_as_rented(self):
        """Mark property as rented."""
        pass

    @transition(
        field=status,
        source=[PropertyStatus.SOLD, PropertyStatus.RENTED],
        target=PropertyStatus.ACTIVE,
        permission="properties.can_approve_property",
    )
    def relist(self):
        """Relist a sold/rented property (admin only)."""
        pass


class PropertyImage(BaseModel):
    """
    Images associated with a property.
    Supports both uploaded images and external URLs.
    """

    property = models.ForeignKey(
        Property,
        on_delete=models.CASCADE,
        related_name="images",
    )
    image = models.ImageField(upload_to="properties/%Y/%m/", blank=True, null=True)
    image_url = models.URLField(blank=True, help_text="External image URL (alternative to upload)")
    caption = models.CharField(max_length=255, blank=True)
    is_main = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)

    def get_image_url(self):
        """Return the image URL, whether from upload or external."""
        if self.image:
            return self.image.url
        return self.image_url or ""

    # Auto-generated thumbnails
    thumbnail = ImageSpecField(
        source="image",
        processors=[ResizeToFill(400, 300)],
        format="JPEG",
        options={"quality": 85},
    )
    large = ImageSpecField(
        source="image",
        processors=[ResizeToFit(1200, 900)],
        format="JPEG",
        options={"quality": 90},
    )

    class Meta:
        verbose_name = "Property Image"
        verbose_name_plural = "Property Images"
        ordering = ["order", "-is_main", "created_at"]

    def __str__(self):
        return f"Image for {self.property.title}"

    def save(self, *args, **kwargs):
        # Ensure only one main image per property
        if self.is_main:
            PropertyImage.objects.filter(property=self.property, is_main=True).exclude(
                pk=self.pk
            ).update(is_main=False)
        super().save(*args, **kwargs)


class SavedProperty(BaseModel):
    """
    Saved/favorited properties by users.
    """

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="saved_properties",
    )
    property = models.ForeignKey(
        Property,
        on_delete=models.CASCADE,
        related_name="saves",
    )

    class Meta:
        verbose_name = "Saved Property"
        verbose_name_plural = "Saved Properties"
        unique_together = ["user", "property"]
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.user.email} saved {self.property.title}"
