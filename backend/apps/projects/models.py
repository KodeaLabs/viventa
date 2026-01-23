"""
Models for the Projects (Development & Pre-Sale) module.
"""

from decimal import Decimal

from django.conf import settings
from django.core.validators import MinValueValidator
from django.db import models
from django.utils import timezone
from django_fsm import FSMField, transition

from apps.common.models import BaseModel
from apps.common.utils import generate_unique_slug


# ==================== Choices ====================


class ProjectStatus(models.TextChoices):
    DRAFT = "draft", "Borrador"
    PRESALE = "presale", "Pre-venta"
    UNDER_CONSTRUCTION = "under_construction", "En Construcción"
    DELIVERED = "delivered", "Entregado"
    CANCELLED = "cancelled", "Cancelado"


class AssetType(models.TextChoices):
    APARTMENT = "apartment", "Apartamento"
    PARKING = "parking", "Estacionamiento"
    STORAGE = "storage", "Maletero"
    COMMERCIAL = "commercial", "Comercial"
    LAND_LOT = "land_lot", "Lote de Terreno"


class AssetStatus(models.TextChoices):
    AVAILABLE = "available", "Disponible"
    RESERVED = "reserved", "Reservado"
    SOLD = "sold", "Vendido"
    DELIVERED = "delivered", "Entregado"


class MilestoneStatus(models.TextChoices):
    PENDING = "pending", "Pendiente"
    IN_PROGRESS = "in_progress", "En Progreso"
    COMPLETED = "completed", "Completado"
    DELAYED = "delayed", "Retrasado"


class ContractStatus(models.TextChoices):
    RESERVED = "reserved", "Reservado"
    SIGNED = "signed", "Firmado"
    ACTIVE = "active", "Activo"
    COMPLETED = "completed", "Completado"
    CANCELLED = "cancelled", "Cancelado"


class PaymentConcept(models.TextChoices):
    INITIAL = "initial", "Inicial"
    MONTHLY = "monthly", "Mensual"
    MILESTONE = "milestone", "Hito"
    FINAL = "final", "Final"
    OTHER = "other", "Otro"


class PaymentStatus(models.TextChoices):
    PENDING = "pending", "Pendiente"
    PAID = "paid", "Pagado"
    OVERDUE = "overdue", "Vencido"
    WAIVED = "waived", "Exonerado"


# ==================== Models ====================


class Project(BaseModel):
    """A real estate development project (building/complex under construction)."""

    # Basic information (bilingual)
    title = models.CharField(max_length=255)
    title_es = models.CharField(max_length=255, blank=True)
    slug = models.SlugField(max_length=300, unique=True, db_index=True)
    description = models.TextField()
    description_es = models.TextField(blank=True)

    # Developer info
    developer_name = models.CharField(max_length=255)
    developer_logo = models.ImageField(
        upload_to="projects/developer_logos/", null=True, blank=True
    )

    # Location
    city = models.CharField(max_length=100, db_index=True)
    state = models.CharField(max_length=100, db_index=True)
    address = models.CharField(max_length=255, blank=True)
    latitude = models.DecimalField(
        max_digits=10, decimal_places=8, null=True, blank=True
    )
    longitude = models.DecimalField(
        max_digits=11, decimal_places=8, null=True, blank=True
    )
    location = models.ForeignKey(
        "common.Location",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="projects",
    )

    # Unit stats
    total_units = models.PositiveIntegerField(default=0)
    sold_units = models.PositiveIntegerField(default=0)
    available_units = models.PositiveIntegerField(default=0)

    # Price range
    price_range_min = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        null=True,
        blank=True,
        validators=[MinValueValidator(Decimal("0.01"))],
        help_text="Minimum price in USD",
    )
    price_range_max = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        null=True,
        blank=True,
        validators=[MinValueValidator(Decimal("0.01"))],
        help_text="Maximum price in USD",
    )

    # Dates
    delivery_date = models.DateField(null=True, blank=True)
    construction_start_date = models.DateField(null=True, blank=True)

    # Features
    amenities = models.JSONField(default=list, blank=True)

    # Media
    master_plan_url = models.URLField(blank=True)
    brochure_url = models.URLField(blank=True)
    video_url = models.URLField(blank=True)
    cover_image = models.ImageField(
        upload_to="projects/covers/%Y/%m/", null=True, blank=True
    )

    # FSM Status
    status = FSMField(
        max_length=25,
        choices=ProjectStatus.choices,
        default=ProjectStatus.DRAFT,
        protected=True,
    )

    # Manager (Project Admin who manages this project)
    manager = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="managed_projects",
        help_text="Project Admin who manages this project",
    )

    # Flags
    is_featured = models.BooleanField(default=False, db_index=True)

    class Meta:
        verbose_name = "Project"
        verbose_name_plural = "Projects"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["status", "city"]),
            models.Index(fields=["price_range_min", "price_range_max"]),
        ]

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = generate_unique_slug(Project, self.title)
        super().save(*args, **kwargs)

    @property
    def location_display(self) -> str:
        return f"{self.city}, {self.state}"

    @property
    def progress_percentage(self) -> int:
        milestones = self.milestones.all()
        if not milestones.exists():
            return 0
        total = milestones.count()
        completed = milestones.filter(status=MilestoneStatus.COMPLETED).count()
        return int((completed / total) * 100)

    # FSM Transitions
    @transition(field=status, source=ProjectStatus.DRAFT, target=ProjectStatus.PRESALE)
    def start_presale(self):
        pass

    @transition(
        field=status,
        source=ProjectStatus.PRESALE,
        target=ProjectStatus.UNDER_CONSTRUCTION,
    )
    def start_construction(self):
        pass

    @transition(
        field=status,
        source=[ProjectStatus.PRESALE, ProjectStatus.UNDER_CONSTRUCTION],
        target=ProjectStatus.DELIVERED,
    )
    def mark_delivered(self):
        pass

    @transition(
        field=status,
        source=[
            ProjectStatus.DRAFT,
            ProjectStatus.PRESALE,
            ProjectStatus.UNDER_CONSTRUCTION,
        ],
        target=ProjectStatus.CANCELLED,
    )
    def cancel(self):
        pass


class ProjectImage(BaseModel):
    """Gallery image for a project."""

    project = models.ForeignKey(
        Project, on_delete=models.CASCADE, related_name="gallery_images"
    )
    image = models.ImageField(
        upload_to="projects/gallery/%Y/%m/", blank=True, null=True
    )
    image_url = models.URLField(blank=True)
    caption = models.CharField(max_length=255, blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "created_at"]
        verbose_name = "Project Image"
        verbose_name_plural = "Project Images"

    def __str__(self):
        return f"Image for {self.project.title}"


class SellableAsset(BaseModel):
    """Individual sellable unit within a project (apartment, parking, storage, etc.)."""

    project = models.ForeignKey(
        Project, on_delete=models.CASCADE, related_name="assets"
    )
    identifier = models.CharField(max_length=50, help_text="e.g. A-301, P-05")
    asset_type = models.CharField(
        max_length=20, choices=AssetType.choices, default=AssetType.APARTMENT
    )
    floor = models.IntegerField(null=True, blank=True)
    area_sqm = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True
    )
    bedrooms = models.PositiveIntegerField(default=0)
    bathrooms = models.DecimalField(max_digits=3, decimal_places=1, default=0)
    price_usd = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        validators=[MinValueValidator(Decimal("0.01"))],
    )
    status = FSMField(
        max_length=20,
        choices=AssetStatus.choices,
        default=AssetStatus.AVAILABLE,
        protected=True,
    )
    floor_plan_url = models.URLField(blank=True)
    features = models.JSONField(default=list, blank=True)

    class Meta:
        verbose_name = "Sellable Asset"
        verbose_name_plural = "Sellable Assets"
        ordering = ["asset_type", "identifier"]
        unique_together = ["project", "identifier"]
        indexes = [
            models.Index(fields=["project", "status"]),
            models.Index(fields=["asset_type"]),
        ]

    def __str__(self):
        return f"{self.project.title} - {self.identifier}"

    # FSM Transitions
    @transition(
        field=status, source=AssetStatus.AVAILABLE, target=AssetStatus.RESERVED
    )
    def reserve(self):
        pass

    @transition(field=status, source=AssetStatus.RESERVED, target=AssetStatus.SOLD)
    def mark_sold(self):
        pass

    @transition(field=status, source=AssetStatus.SOLD, target=AssetStatus.DELIVERED)
    def deliver(self):
        pass

    @transition(
        field=status, source=AssetStatus.RESERVED, target=AssetStatus.AVAILABLE
    )
    def release(self):
        """Release a reserved asset back to available."""
        pass


class ProjectMilestone(BaseModel):
    """Construction progress milestone for a project."""

    project = models.ForeignKey(
        Project, on_delete=models.CASCADE, related_name="milestones"
    )
    title = models.CharField(max_length=255)
    title_es = models.CharField(max_length=255, blank=True)
    description = models.TextField(blank=True)
    description_es = models.TextField(blank=True)
    target_date = models.DateField(null=True, blank=True)
    completed_date = models.DateField(null=True, blank=True)
    percentage = models.PositiveIntegerField(
        default=0, help_text="Percentage contribution to overall progress"
    )
    status = models.CharField(
        max_length=20,
        choices=MilestoneStatus.choices,
        default=MilestoneStatus.PENDING,
    )
    order = models.PositiveIntegerField(default=0)

    class Meta:
        verbose_name = "Project Milestone"
        verbose_name_plural = "Project Milestones"
        ordering = ["order", "target_date"]

    def __str__(self):
        return f"{self.project.title} - {self.title}"


class BuyerContract(BaseModel):
    """Links a buyer (User) to a SellableAsset with payment terms."""

    asset = models.ForeignKey(
        SellableAsset, on_delete=models.PROTECT, related_name="contracts"
    )
    buyer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="buyer_contracts",
    )
    contract_date = models.DateField(null=True, blank=True)
    total_price = models.DecimalField(max_digits=12, decimal_places=2)
    initial_payment = models.DecimalField(
        max_digits=12, decimal_places=2, default=0
    )
    payment_plan_months = models.PositiveIntegerField(default=0)
    status = FSMField(
        max_length=20,
        choices=ContractStatus.choices,
        default=ContractStatus.RESERVED,
        protected=True,
    )
    notes = models.TextField(blank=True)

    class Meta:
        verbose_name = "Buyer Contract"
        verbose_name_plural = "Buyer Contracts"
        ordering = ["-created_at"]
        constraints = [
            models.UniqueConstraint(
                fields=["asset"],
                condition=models.Q(
                    status__in=["reserved", "signed", "active"]
                ),
                name="unique_active_contract_per_asset",
            )
        ]

    def __str__(self):
        return f"Contract: {self.buyer.email} - {self.asset.identifier}"

    # FSM Transitions
    @transition(
        field=status, source=ContractStatus.RESERVED, target=ContractStatus.SIGNED
    )
    def sign(self):
        pass

    @transition(
        field=status, source=ContractStatus.SIGNED, target=ContractStatus.ACTIVE
    )
    def activate(self):
        pass

    @transition(
        field=status, source=ContractStatus.ACTIVE, target=ContractStatus.COMPLETED
    )
    def complete(self):
        pass

    @transition(
        field=status,
        source=[
            ContractStatus.RESERVED,
            ContractStatus.SIGNED,
            ContractStatus.ACTIVE,
        ],
        target=ContractStatus.CANCELLED,
    )
    def cancel(self):
        pass


class PaymentScheduleItem(BaseModel):
    """Individual payment within a buyer contract."""

    contract = models.ForeignKey(
        BuyerContract, on_delete=models.CASCADE, related_name="payments"
    )
    due_date = models.DateField()
    amount_usd = models.DecimalField(max_digits=12, decimal_places=2)
    concept = models.CharField(
        max_length=20,
        choices=PaymentConcept.choices,
        default=PaymentConcept.MONTHLY,
    )
    status = models.CharField(
        max_length=20,
        choices=PaymentStatus.choices,
        default=PaymentStatus.PENDING,
    )
    paid_date = models.DateField(null=True, blank=True)
    payment_reference = models.CharField(max_length=255, blank=True)
    notes = models.TextField(blank=True)

    class Meta:
        verbose_name = "Payment Schedule Item"
        verbose_name_plural = "Payment Schedule Items"
        ordering = ["due_date"]

    def __str__(self):
        return f"{self.contract} - {self.due_date} - ${self.amount_usd}"


class ProjectUpdate(BaseModel):
    """News/progress update post for a project."""

    project = models.ForeignKey(
        Project, on_delete=models.CASCADE, related_name="updates"
    )
    title = models.CharField(max_length=255)
    title_es = models.CharField(max_length=255, blank=True)
    content = models.TextField()
    content_es = models.TextField(blank=True)
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="project_updates",
    )
    image = models.ImageField(
        upload_to="projects/updates/%Y/%m/", null=True, blank=True
    )
    is_public = models.BooleanField(default=True)
    published_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        verbose_name = "Project Update"
        verbose_name_plural = "Project Updates"
        ordering = ["-published_at", "-created_at"]

    def __str__(self):
        return f"{self.project.title} - {self.title}"

    def save(self, *args, **kwargs):
        if self.is_public and not self.published_at:
            self.published_at = timezone.now()
        super().save(*args, **kwargs)
