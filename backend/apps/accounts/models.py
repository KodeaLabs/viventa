"""
User models for the application.
"""

from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models

from apps.common.models import TimeStampedModel


class UserManager(BaseUserManager):
    """
    Custom user manager for email-based authentication.
    """

    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("The Email field must be set")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)
        extra_fields.setdefault("role", User.Role.ADMIN)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        return self.create_user(email, password, **extra_fields)


class User(AbstractUser, TimeStampedModel):
    """
    Custom user model with email as the primary identifier.
    Supports individual realtors and real estate companies.
    """

    class Role(models.TextChoices):
        ADMIN = "admin", "Administrator"
        AGENT = "agent", "Real Estate Agent"
        PROJECT_ADMIN = "project_admin", "Project Administrator"
        BUYER = "buyer", "Buyer"

    class AgentType(models.TextChoices):
        INDIVIDUAL = "individual", "Independent Realtor"
        COMPANY = "company", "Real Estate Company"

    username = None
    email = models.EmailField(unique=True, db_index=True)
    auth0_id = models.CharField(max_length=255, unique=True, null=True, blank=True, db_index=True)

    # Profile fields
    first_name = models.CharField(max_length=150, blank=True)
    last_name = models.CharField(max_length=150, blank=True)
    phone = models.CharField(max_length=20, blank=True)
    avatar = models.ImageField(upload_to="avatars/", null=True, blank=True)
    avatar_url = models.URLField(blank=True, help_text="External avatar URL (alternative to upload)")
    slug = models.SlugField(max_length=200, unique=True, null=True, blank=True, db_index=True)

    # Role and permissions
    role = models.CharField(max_length=20, choices=Role.choices, default=Role.BUYER)

    # Agent-specific fields
    agent_type = models.CharField(
        max_length=20,
        choices=AgentType.choices,
        default=AgentType.INDIVIDUAL,
        blank=True,
    )
    company_name = models.CharField(max_length=255, blank=True, help_text="Company/Brokerage name")
    license_number = models.CharField(max_length=100, blank=True)
    bio = models.TextField(blank=True)
    bio_es = models.TextField(blank=True, help_text="Spanish bio")
    is_verified_agent = models.BooleanField(default=False)

    # Company/Broker specific fields
    logo = models.ImageField(upload_to="company_logos/", null=True, blank=True)
    website = models.URLField(blank=True)
    founded_year = models.PositiveIntegerField(null=True, blank=True)
    team_size = models.PositiveIntegerField(default=1, help_text="Number of team members")

    # Company hierarchy - agents can belong to a company
    parent_company = models.ForeignKey(
        "self",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="team_members",
        limit_choices_to={"agent_type": "company"},
        help_text="Company this agent works for",
    )

    # Location
    city = models.CharField(max_length=100, blank=True)
    state = models.CharField(max_length=100, blank=True)

    # Social links
    whatsapp = models.CharField(max_length=20, blank=True)
    instagram = models.CharField(max_length=100, blank=True)
    facebook = models.URLField(blank=True)
    linkedin = models.URLField(blank=True)

    # Stats (denormalized for performance)
    total_listings = models.PositiveIntegerField(default=0)
    total_sales = models.PositiveIntegerField(default=0)

    # Referral system
    referred_by = models.ForeignKey(
        "self",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="referrals",
        limit_choices_to={"is_referrer": True},
        help_text="Staff member or agent who referred this user",
    )
    referral_date = models.DateTimeField(null=True, blank=True, help_text="When the agent was referred")
    referral_fee_status = models.CharField(
        max_length=20,
        choices=[
            ("pending", "Pending"),
            ("paid", "Paid"),
            ("waived", "Waived"),
            ("na", "Not Applicable"),
        ],
        default="na",
        help_text="Status of referral fee payment",
    )
    referral_notes = models.TextField(blank=True, help_text="Notes about the referral")
    is_referrer = models.BooleanField(
        default=False,
        help_text="Can this user refer new agents to the platform?",
    )

    # Preferences
    preferred_language = models.CharField(
        max_length=5,
        choices=[("en", "English"), ("es", "Spanish")],
        default="es",
    )

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = UserManager()

    class Meta:
        verbose_name = "User"
        verbose_name_plural = "Users"
        ordering = ["-created_at"]

    def __str__(self):
        return self.display_name

    def save(self, *args, **kwargs):
        # Auto-generate slug for agents
        if self.role == self.Role.AGENT and not self.slug:
            from apps.common.utils import generate_unique_slug
            base_name = self.company_name if self.agent_type == 'company' else self.full_name
            self.slug = generate_unique_slug(User, base_name or self.email.split('@')[0])
        super().save(*args, **kwargs)

    @property
    def full_name(self) -> str:
        return f"{self.first_name} {self.last_name}".strip() or self.email

    @property
    def display_name(self) -> str:
        """Return the appropriate display name based on agent type."""
        if self.role == self.Role.AGENT and self.agent_type == 'company':
            return self.company_name or self.full_name
        return self.full_name

    @property
    def is_agent(self) -> bool:
        return self.role == self.Role.AGENT

    @property
    def is_company(self) -> bool:
        return self.role == self.Role.AGENT and self.agent_type == self.AgentType.COMPANY

    @property
    def is_admin(self) -> bool:
        return self.role == self.Role.ADMIN

    @property
    def is_project_admin(self) -> bool:
        return self.role == self.Role.PROJECT_ADMIN

    @property
    def location_display(self) -> str:
        """Return formatted location string."""
        if self.city and self.state:
            return f"{self.city}, {self.state}"
        return self.city or self.state or "Venezuela"

