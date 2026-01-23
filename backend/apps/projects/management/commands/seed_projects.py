"""
Management command to seed sample projects with assets and milestones.
"""

from datetime import date, timedelta
from decimal import Decimal

from django.core.management.base import BaseCommand

from apps.projects.models import (
    AssetStatus,
    AssetType,
    BuyerContract,
    ContractStatus,
    MilestoneStatus,
    PaymentConcept,
    PaymentScheduleItem,
    PaymentStatus,
    Project,
    ProjectImage,
    ProjectMilestone,
    ProjectStatus,
    ProjectUpdate,
    SellableAsset,
)


class Command(BaseCommand):
    help = "Seed sample projects with assets, milestones, and updates for testing"

    def handle(self, *args, **options):
        self.stdout.write("Seeding projects...")

        # Project 1: Pre-sale (Margarita Beach Tower)
        project1 = self._create_project(
            title="Margarita Beach Tower",
            title_es="Torre Playa Margarita",
            description="Luxury beachfront tower with panoramic ocean views. Modern apartments designed for the discerning buyer seeking a tropical lifestyle.",
            description_es="Torre de lujo frente al mar con vistas panorámicas al océano. Apartamentos modernos diseñados para el comprador exigente que busca un estilo de vida tropical.",
            developer_name="Grupo Constructor Caribe",
            city="Porlamar",
            state="Nueva Esparta",
            address="Av. Santiago Mariño, Sector Playa El Angel",
            total_units=48,
            sold_units=12,
            available_units=36,
            price_range_min=Decimal("85000.00"),
            price_range_max=Decimal("250000.00"),
            delivery_date=date.today() + timedelta(days=730),
            construction_start_date=date.today() - timedelta(days=90),
            amenities=["Pool", "Gym", "Beach Access", "Parking", "Security 24/7", "Rooftop Lounge"],
            status_target="presale",
            is_featured=True,
        )

        # Project 2: Under Construction (Caracas Urban Living)
        project2 = self._create_project(
            title="Caracas Urban Living",
            title_es="Caracas Urban Living",
            description="Contemporary urban development in the heart of Caracas. Walking distance to shopping, dining, and entertainment.",
            description_es="Desarrollo urbano contemporáneo en el corazón de Caracas. A poca distancia de tiendas, restaurantes y entretenimiento.",
            developer_name="Desarrollos Metropolitanos C.A.",
            city="Caracas",
            state="Distrito Capital",
            address="Av. Francisco de Miranda, Chacao",
            total_units=120,
            sold_units=65,
            available_units=55,
            price_range_min=Decimal("45000.00"),
            price_range_max=Decimal("180000.00"),
            delivery_date=date.today() + timedelta(days=365),
            construction_start_date=date.today() - timedelta(days=365),
            amenities=["Gym", "Co-Working Space", "Parking", "Security", "Children's Area", "EV Charging"],
            status_target="under_construction",
            is_featured=True,
        )

        # Project 3: Delivered (Los Roques Villas)
        project3 = self._create_project(
            title="Los Roques Exclusive Villas",
            title_es="Villas Exclusivas Los Roques",
            description="Exclusive collection of 8 beachfront villas in the pristine Los Roques archipelago. Each villa features private beach access and infinity pool.",
            description_es="Colección exclusiva de 8 villas frente al mar en el prístino archipiélago de Los Roques. Cada villa cuenta con acceso privado a la playa y piscina infinita.",
            developer_name="Inversiones Insulares",
            city="Los Roques",
            state="Dependencias Federales",
            address="Gran Roque, Sector Playa Norte",
            total_units=8,
            sold_units=8,
            available_units=0,
            price_range_min=Decimal("350000.00"),
            price_range_max=Decimal("750000.00"),
            delivery_date=date.today() - timedelta(days=180),
            construction_start_date=date.today() - timedelta(days=900),
            amenities=["Private Beach", "Infinity Pool", "Marina Access", "Concierge", "Solar Power"],
            status_target="delivered",
            is_featured=False,
        )

        # Add assets to each project
        self._create_assets_for_project(project1, "presale")
        self._create_assets_for_project(project2, "mixed")
        self._create_assets_for_project(project3, "delivered")

        # Add milestones
        self._create_milestones(project1, "early")
        self._create_milestones(project2, "mid")
        self._create_milestones(project3, "completed")

        # Add updates
        self._create_updates(project1)
        self._create_updates(project2)

        # Add gallery images (Unsplash URLs)
        self._create_gallery_images(project1)
        self._create_gallery_images(project2)
        self._create_gallery_images(project3)

        self.stdout.write(self.style.SUCCESS("Successfully seeded 3 projects with assets, milestones, and updates."))

    def _create_project(self, status_target="draft", **kwargs):
        project, created = Project.objects.get_or_create(
            title=kwargs["title"],
            defaults=kwargs,
        )
        if created:
            # Transition to target status
            if status_target == "presale":
                project.start_presale()
                project.save()
            elif status_target == "under_construction":
                project.start_presale()
                project.save()
                project.start_construction()
                project.save()
            elif status_target == "delivered":
                project.start_presale()
                project.save()
                project.start_construction()
                project.save()
                project.mark_delivered()
                project.save()
            self.stdout.write(f"  Created project: {project.title} ({project.status})")
        else:
            self.stdout.write(f"  Project already exists: {project.title}")
        return project

    def _create_assets_for_project(self, project, asset_profile):
        if project.assets.exists():
            return

        apartments = [
            ("A-101", 1, Decimal("75.5"), 2, 2, Decimal("85000.00")),
            ("A-102", 1, Decimal("92.0"), 3, 2, Decimal("105000.00")),
            ("A-201", 2, Decimal("75.5"), 2, 2, Decimal("90000.00")),
            ("A-202", 2, Decimal("110.0"), 3, 3, Decimal("135000.00")),
            ("A-301", 3, Decimal("75.5"), 2, 2, Decimal("95000.00")),
            ("A-302", 3, Decimal("125.0"), 4, 3, Decimal("165000.00")),
            ("PH-401", 4, Decimal("180.0"), 4, 4, Decimal("250000.00")),
        ]

        for ident, floor, area, beds, baths, price in apartments:
            asset = SellableAsset.objects.create(
                project=project,
                identifier=ident,
                asset_type=AssetType.APARTMENT,
                floor=floor,
                area_sqm=area,
                bedrooms=beds,
                bathrooms=baths,
                price_usd=price,
                features=["Balcony", "Ocean View"] if floor >= 3 else ["Garden View"],
            )
            # Set status based on profile
            if asset_profile == "delivered":
                asset.reserve()
                asset.save()
                asset.mark_sold()
                asset.save()
                asset.deliver()
                asset.save()
            elif asset_profile == "mixed" and ident in ("A-101", "A-102", "A-201"):
                asset.reserve()
                asset.save()
                asset.mark_sold()
                asset.save()

        # Add parking spots
        for i in range(1, 4):
            SellableAsset.objects.create(
                project=project,
                identifier=f"P-{i:02d}",
                asset_type=AssetType.PARKING,
                floor=-1,
                area_sqm=Decimal("12.5"),
                price_usd=Decimal("8000.00"),
            )

        self.stdout.write(f"    Created assets for: {project.title}")

    def _create_milestones(self, project, phase):
        if project.milestones.exists():
            return

        milestones_data = [
            ("Foundation", "Fundación", "Foundation and structural base", 1),
            ("Structure", "Estructura", "Main building structure", 2),
            ("Electrical & Plumbing", "Electricidad y Plomería", "Internal systems installation", 3),
            ("Finishing", "Acabados", "Interior and exterior finishing", 4),
            ("Delivery", "Entrega", "Final inspection and key delivery", 5),
        ]

        for title, title_es, desc, order in milestones_data:
            target = date.today() + timedelta(days=order * 150)
            if phase == "completed":
                ms_status = MilestoneStatus.COMPLETED
                completed = date.today() - timedelta(days=(5 - order) * 100)
            elif phase == "mid" and order <= 3:
                ms_status = MilestoneStatus.COMPLETED if order <= 2 else MilestoneStatus.IN_PROGRESS
                completed = date.today() - timedelta(days=(3 - order) * 90) if order <= 2 else None
            elif phase == "early" and order == 1:
                ms_status = MilestoneStatus.IN_PROGRESS
                completed = None
            else:
                ms_status = MilestoneStatus.PENDING
                completed = None

            ProjectMilestone.objects.create(
                project=project,
                title=title,
                title_es=title_es,
                description=desc,
                target_date=target,
                completed_date=completed,
                percentage=20,
                status=ms_status,
                order=order,
            )

        self.stdout.write(f"    Created milestones for: {project.title}")

    def _create_updates(self, project):
        if project.updates.exists():
            return

        ProjectUpdate.objects.create(
            project=project,
            title="Construction Progress Update",
            title_es="Actualización del Progreso de Construcción",
            content="We're excited to share the latest progress on our development. The foundation work has been completed ahead of schedule.",
            content_es="Estamos emocionados de compartir el último progreso de nuestro desarrollo. Los trabajos de fundación se han completado antes de lo previsto.",
            is_public=True,
        )
        ProjectUpdate.objects.create(
            project=project,
            title="New Amenities Announced",
            title_es="Nuevas Amenidades Anunciadas",
            content="We're adding a co-working space and EV charging stations to the project amenities list.",
            content_es="Estamos agregando un espacio de co-working y estaciones de carga para vehículos eléctricos a la lista de amenidades del proyecto.",
            is_public=True,
        )

        self.stdout.write(f"    Created updates for: {project.title}")

    def _create_gallery_images(self, project):
        if project.gallery_images.exists():
            return

        image_urls = [
            "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800",
            "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800",
            "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
        ]

        for i, url in enumerate(image_urls):
            ProjectImage.objects.create(
                project=project,
                image_url=url,
                caption=f"Project view {i + 1}",
                order=i,
            )

        self.stdout.write(f"    Created gallery images for: {project.title}")
