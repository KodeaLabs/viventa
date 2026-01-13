"""
Inquiry models for property interest requests.
"""

from django.conf import settings
from django.db import models

from apps.common.models import BaseModel
from apps.properties.models import Property


class InquiryStatus(models.TextChoices):
    """Status of an inquiry."""

    NEW = "new", "New"
    CONTACTED = "contacted", "Contacted"
    IN_PROGRESS = "in_progress", "In Progress"
    QUALIFIED = "qualified", "Qualified Lead"
    CLOSED = "closed", "Closed"
    SPAM = "spam", "Spam"


class Inquiry(BaseModel):
    """
    Inquiry/contact request from potential buyers.
    """

    # Property reference
    property_listing = models.ForeignKey(
        Property,
        on_delete=models.CASCADE,
        related_name="inquiries",
        db_column="property_id",  # Keep same DB column for compatibility
    )

    # Contact information
    full_name = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=30, blank=True)
    country = models.CharField(max_length=100, blank=True)

    # Message
    message = models.TextField()

    # Preferences
    preferred_contact_method = models.CharField(
        max_length=20,
        choices=[
            ("email", "Email"),
            ("phone", "Phone"),
            ("whatsapp", "WhatsApp"),
        ],
        default="email",
    )
    preferred_language = models.CharField(
        max_length=5,
        choices=[("en", "English"), ("es", "Spanish")],
        default="en",
    )

    # Budget (optional)
    budget_min = models.DecimalField(
        max_digits=12, decimal_places=2, null=True, blank=True
    )
    budget_max = models.DecimalField(
        max_digits=12, decimal_places=2, null=True, blank=True
    )

    # Status tracking
    status = models.CharField(
        max_length=20, choices=InquiryStatus.choices, default=InquiryStatus.NEW
    )

    # Internal notes (for agents)
    internal_notes = models.TextField(blank=True)

    # Linked user (if they were logged in)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="inquiries",
    )

    # Tracking
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    referrer = models.URLField(blank=True)

    class Meta:
        verbose_name = "Inquiry"
        verbose_name_plural = "Inquiries"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["status"]),
            models.Index(fields=["email"]),
            models.Index(fields=["property_listing", "status"]),
        ]

    def __str__(self):
        return f"Inquiry from {self.full_name} for {self.property_listing.title}"

    @property
    def agent(self):
        """Get the agent responsible for this inquiry's property."""
        return self.property_listing.agent


class InquiryNote(BaseModel):
    """
    Notes/follow-ups on an inquiry.
    """

    inquiry = models.ForeignKey(
        Inquiry,
        on_delete=models.CASCADE,
        related_name="notes",
    )
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="inquiry_notes",
    )
    content = models.TextField()

    class Meta:
        verbose_name = "Inquiry Note"
        verbose_name_plural = "Inquiry Notes"
        ordering = ["-created_at"]

    def __str__(self):
        return f"Note by {self.author.email} on {self.inquiry}"
