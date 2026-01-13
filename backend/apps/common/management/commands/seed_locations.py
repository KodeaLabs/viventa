"""
Seed initial locations for Venezuela.
"""

from django.core.management.base import BaseCommand

from apps.common.models import Location, LocationType


class Command(BaseCommand):
    help = "Seed initial Venezuelan locations (islands, cities, destinations)"

    LOCATIONS = [
        # Islands - Nueva Esparta State
        {
            "name": "Isla de Margarita",
            "name_es": "Isla de Margarita",
            "slug": "margarita",
            "location_type": LocationType.ISLAND,
            "state": "Nueva Esparta",
            "latitude": 10.9577,
            "longitude": -63.8697,
            "description": "Venezuela's premier beach destination, known for duty-free shopping and stunning Caribbean beaches.",
            "description_es": "El principal destino de playa de Venezuela, conocido por sus compras libres de impuestos y sus impresionantes playas caribeñas.",
            "is_featured": True,
            "display_order": 1,
        },
        {
            "name": "Isla de Coche",
            "name_es": "Isla de Coche",
            "slug": "coche",
            "location_type": LocationType.ISLAND,
            "state": "Nueva Esparta",
            "latitude": 10.7667,
            "longitude": -63.9667,
            "description": "Tranquil island paradise famous for kitesurfing and pristine beaches.",
            "description_es": "Paraíso isleño tranquilo famoso por el kitesurf y sus playas vírgenes.",
            "is_featured": True,
            "display_order": 2,
        },
        # Los Roques - Federal Dependencies
        {
            "name": "Los Roques",
            "name_es": "Los Roques",
            "slug": "los-roques",
            "location_type": LocationType.ISLAND,
            "state": "Dependencias Federales",
            "latitude": 11.8500,
            "longitude": -66.7500,
            "description": "National park archipelago with crystal-clear waters and world-class diving.",
            "description_es": "Archipiélago parque nacional con aguas cristalinas y buceo de clase mundial.",
            "is_featured": True,
            "display_order": 3,
        },
        # Major Cities
        {
            "name": "Caracas",
            "name_es": "Caracas",
            "slug": "caracas",
            "location_type": LocationType.CITY,
            "state": "Distrito Capital",
            "latitude": 10.4806,
            "longitude": -66.9036,
            "description": "Venezuela's capital city, nestled in a valley with mountain views.",
            "description_es": "La capital de Venezuela, ubicada en un valle con vistas a las montañas.",
            "is_featured": True,
            "display_order": 10,
        },
        {
            "name": "Valencia",
            "name_es": "Valencia",
            "slug": "valencia",
            "location_type": LocationType.CITY,
            "state": "Carabobo",
            "latitude": 10.1620,
            "longitude": -67.9993,
            "description": "Industrial hub with nearby beaches and Lake Valencia.",
            "description_es": "Centro industrial con playas cercanas y el Lago de Valencia.",
            "is_featured": False,
            "display_order": 11,
        },
        {
            "name": "Maracaibo",
            "name_es": "Maracaibo",
            "slug": "maracaibo",
            "location_type": LocationType.CITY,
            "state": "Zulia",
            "latitude": 10.6544,
            "longitude": -71.6290,
            "description": "Venezuela's second largest city, known for its lake and oil industry.",
            "description_es": "La segunda ciudad más grande de Venezuela, conocida por su lago y la industria petrolera.",
            "is_featured": False,
            "display_order": 12,
        },
        # Beach destinations in Margarita
        {
            "name": "Porlamar",
            "name_es": "Porlamar",
            "slug": "porlamar",
            "location_type": LocationType.CITY,
            "state": "Nueva Esparta",
            "latitude": 10.9578,
            "longitude": -63.8514,
            "description": "Main commercial center of Margarita Island with beaches and shopping.",
            "description_es": "Principal centro comercial de Isla Margarita con playas y tiendas.",
            "is_featured": False,
            "display_order": 20,
        },
        {
            "name": "Pampatar",
            "name_es": "Pampatar",
            "slug": "pampatar",
            "location_type": LocationType.CITY,
            "state": "Nueva Esparta",
            "latitude": 10.9986,
            "longitude": -63.7839,
            "description": "Historic fishing village with a colonial fortress and duty-free shops.",
            "description_es": "Pueblo pesquero histórico con una fortaleza colonial y tiendas libres de impuestos.",
            "is_featured": False,
            "display_order": 21,
        },
        {
            "name": "Playa El Agua",
            "name_es": "Playa El Agua",
            "slug": "playa-el-agua",
            "location_type": LocationType.BEACH,
            "state": "Nueva Esparta",
            "latitude": 11.1119,
            "longitude": -63.8403,
            "description": "Margarita's most famous beach, known for its waves and beach bars.",
            "description_es": "La playa más famosa de Margarita, conocida por sus olas y chiringuitos.",
            "is_featured": True,
            "display_order": 22,
        },
        # Mountain destinations
        {
            "name": "Mérida",
            "name_es": "Mérida",
            "slug": "merida",
            "location_type": LocationType.CITY,
            "state": "Mérida",
            "latitude": 8.5897,
            "longitude": -71.1561,
            "description": "Andean city with the world's highest cable car and mountain adventures.",
            "description_es": "Ciudad andina con el teleférico más alto del mundo y aventuras de montaña.",
            "is_featured": True,
            "display_order": 30,
        },
        {
            "name": "Colonia Tovar",
            "name_es": "Colonia Tovar",
            "slug": "colonia-tovar",
            "location_type": LocationType.MOUNTAIN,
            "state": "Aragua",
            "latitude": 10.4083,
            "longitude": -67.2897,
            "description": "German-influenced mountain village with cool climate and European architecture.",
            "description_es": "Pueblo de montaña de influencia alemana con clima fresco y arquitectura europea.",
            "is_featured": False,
            "display_order": 31,
        },
        {
            "name": "Galipán",
            "name_es": "Galipán",
            "slug": "galipan",
            "location_type": LocationType.MOUNTAIN,
            "state": "Vargas",
            "latitude": 10.5500,
            "longitude": -66.8833,
            "description": "Mountain village above Caracas with flower farms and stunning views.",
            "description_es": "Pueblo de montaña sobre Caracas con cultivos de flores y vistas impresionantes.",
            "is_featured": False,
            "display_order": 32,
        },
        # Coastal cities
        {
            "name": "Puerto La Cruz",
            "name_es": "Puerto La Cruz",
            "slug": "puerto-la-cruz",
            "location_type": LocationType.CITY,
            "state": "Anzoátegui",
            "latitude": 10.2122,
            "longitude": -64.6303,
            "description": "Gateway to Mochima National Park with marina and beaches.",
            "description_es": "Puerta de entrada al Parque Nacional Mochima con marina y playas.",
            "is_featured": False,
            "display_order": 40,
        },
        {
            "name": "Lechería",
            "name_es": "Lechería",
            "slug": "lecheria",
            "location_type": LocationType.CITY,
            "state": "Anzoátegui",
            "latitude": 10.1833,
            "longitude": -64.6833,
            "description": "Modern beach city with upscale developments and yacht clubs.",
            "description_es": "Ciudad playera moderna con desarrollos de lujo y clubes náuticos.",
            "is_featured": True,
            "display_order": 41,
        },
        {
            "name": "Higuerote",
            "name_es": "Higuerote",
            "slug": "higuerote",
            "location_type": LocationType.BEACH,
            "state": "Miranda",
            "latitude": 10.4667,
            "longitude": -66.1000,
            "description": "Popular beach destination near Caracas with coconut palms.",
            "description_es": "Destino de playa popular cerca de Caracas con cocoteros.",
            "is_featured": False,
            "display_order": 42,
        },
        {
            "name": "Choroní",
            "name_es": "Choroní",
            "slug": "choroni",
            "location_type": LocationType.BEACH,
            "state": "Aragua",
            "latitude": 10.5000,
            "longitude": -67.6167,
            "description": "Colonial beach town with Afro-Venezuelan culture and cacao plantations.",
            "description_es": "Pueblo playero colonial con cultura afrovenezolana y plantaciones de cacao.",
            "is_featured": True,
            "display_order": 43,
        },
    ]

    def handle(self, *args, **options):
        self.stdout.write("Seeding Venezuelan locations...")

        created_count = 0
        updated_count = 0

        for loc_data in self.LOCATIONS:
            location, created = Location.objects.update_or_create(
                slug=loc_data["slug"],
                defaults=loc_data,
            )

            if created:
                created_count += 1
                self.stdout.write(self.style.SUCCESS(f"  Created: {location.name}"))
            else:
                updated_count += 1
                self.stdout.write(f"  Updated: {location.name}")

        self.stdout.write(
            self.style.SUCCESS(
                f"\nDone! Created {created_count}, updated {updated_count} locations."
            )
        )
