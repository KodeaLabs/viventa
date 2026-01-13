"""
Management command to seed the database with sample properties.
"""
import random
from decimal import Decimal

from django.core.management.base import BaseCommand

from apps.accounts.models import User
from apps.properties.models import Property, PropertyImage, PropertyStatus


class Command(BaseCommand):
    help = 'Seeds the database with sample properties'

    # Real estate images from Unsplash - expanded collection
    PROPERTY_IMAGES = {
        'beach': [
            'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=1200&auto=format',
            'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&auto=format',
            'https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=1200&auto=format',
            'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format',
            'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&auto=format',
            'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=1200&auto=format',
        ],
        'villa': [
            'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&auto=format',
            'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&auto=format',
            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format',
            'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&auto=format',
            'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1200&auto=format',
            'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&auto=format',
        ],
        'apartment': [
            'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&auto=format',
            'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&auto=format',
            'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&auto=format',
            'https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?w=1200&auto=format',
            'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&auto=format',
            'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=1200&auto=format',
        ],
        'penthouse': [
            'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1200&auto=format',
            'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=1200&auto=format',
            'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&auto=format',
            'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=1200&auto=format',
        ],
        'house': [
            'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1200&auto=format',
            'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1200&auto=format',
            'https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=1200&auto=format',
            'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&auto=format',
            'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=1200&auto=format',
        ],
        'finca': [
            'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&auto=format',
            'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&auto=format',
            'https://images.unsplash.com/photo-1500076656116-558758c991c1?w=1200&auto=format',
            'https://images.unsplash.com/photo-1595521624992-48a59aef95e3?w=1200&auto=format',
            'https://images.unsplash.com/photo-1559494007-9f5847c49d94?w=1200&auto=format',
        ],
        'commercial': [
            'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format',
            'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&auto=format',
            'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1200&auto=format',
        ],
        'land': [
            'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&auto=format',
            'https://images.unsplash.com/photo-1628624747186-a941c476b7ef?w=1200&auto=format',
            'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200&auto=format',
        ],
        'interior': [
            'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&auto=format',
            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format',
            'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=1200&auto=format',
            'https://images.unsplash.com/photo-1560440021-33f9b867899d?w=1200&auto=format',
            'https://images.unsplash.com/photo-1616137466211-f939a420be84?w=1200&auto=format',
            'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&auto=format',
        ],
        'pool': [
            'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&auto=format',
            'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=1200&auto=format',
            'https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?w=1200&auto=format',
        ],
    }

    # Professional headshot photos for agents
    AGENT_PHOTOS = [
        'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format',  # Business man
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format',  # Business woman
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format',  # Man casual
        'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format',  # Woman professional
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format',  # Man smiling
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&auto=format',  # Woman smiling
    ]

    FEATURES_EN = [
        'Swimming Pool', 'Private Beach Access', 'Ocean View', 'Mountain View',
        'Air Conditioning', 'Smart Home System', 'Security System', '24/7 Security',
        'Private Parking', 'Garage', 'Garden', 'Terrace', 'Balcony',
        'Jacuzzi', 'BBQ Area', 'Gym', 'Tennis Court', 'Wine Cellar',
        'Home Theater', 'Maid Quarters', 'Laundry Room', 'Solar Panels',
        'Generator', 'Water Tank', 'Furnished', 'Pet Friendly',
    ]

    FEATURES_ES = [
        'Piscina', 'Acceso Privado a Playa', 'Vista al Mar', 'Vista a la Montaña',
        'Aire Acondicionado', 'Sistema Domótico', 'Sistema de Seguridad', 'Seguridad 24/7',
        'Estacionamiento Privado', 'Garaje', 'Jardín', 'Terraza', 'Balcón',
        'Jacuzzi', 'Área de BBQ', 'Gimnasio', 'Cancha de Tenis', 'Cava',
        'Cine en Casa', 'Habitación de Servicio', 'Lavandería', 'Paneles Solares',
        'Planta Eléctrica', 'Tanque de Agua', 'Amueblado', 'Acepta Mascotas',
    ]

    SAMPLE_PROPERTIES = [
        # Beach Apartments
        {
            'title': 'Luxury Beach Apartment in Playa El Agua',
            'description': 'Stunning 2-bedroom beach apartment with direct ocean views in the famous Playa El Agua. Features modern design, fully equipped kitchen, and access to resort-style amenities including pool and beach service. Perfect for vacation rental investment.',
            'description_es': 'Impresionante apartamento de playa de 2 habitaciones con vistas directas al océano en la famosa Playa El Agua. Diseño moderno, cocina completamente equipada y acceso a amenidades estilo resort incluyendo piscina y servicio de playa.',
            'property_type': 'beach_apartment',
            'listing_type': 'sale',
            'price': Decimal('165000'),
            'bedrooms': 2,
            'bathrooms': Decimal('2'),
            'area_sqm': Decimal('95'),
            'city': 'Playa El Agua',
            'state': 'Nueva Esparta',
            'is_featured': True,
            'is_beachfront': True,
            'features': ['Ocean View', 'Swimming Pool', 'Air Conditioning', 'Furnished', 'Security System'],
        },
        {
            'title': 'Oceanfront Studio in Pampatar',
            'description': 'Cozy oceanfront studio apartment in historic Pampatar. Walking distance to restaurants, shops, and the famous Pampatar Castle. Ideal for single travelers or couples seeking beach lifestyle.',
            'description_es': 'Acogedor estudio frente al mar en el histórico Pampatar. A poca distancia de restaurantes, tiendas y el famoso Castillo de Pampatar. Ideal para viajeros solos o parejas.',
            'property_type': 'beach_apartment',
            'listing_type': 'sale',
            'price': Decimal('78000'),
            'bedrooms': 1,
            'bathrooms': Decimal('1'),
            'area_sqm': Decimal('48'),
            'city': 'Pampatar',
            'state': 'Nueva Esparta',
            'is_beachfront': True,
            'features': ['Ocean View', 'Air Conditioning', 'Furnished'],
        },
        {
            'title': 'Premium Beach Apartment in Lechería',
            'description': '3-bedroom luxury apartment in exclusive Lechería beach complex. Features private balcony with Caribbean views, modern finishes, and access to private beach club, pools, and tennis courts.',
            'description_es': 'Apartamento de lujo de 3 habitaciones en exclusivo complejo de playa en Lechería. Balcón privado con vistas al Caribe, acabados modernos y acceso a club de playa privado, piscinas y canchas de tenis.',
            'property_type': 'beach_apartment',
            'listing_type': 'sale',
            'price': Decimal('245000'),
            'bedrooms': 3,
            'bathrooms': Decimal('3'),
            'area_sqm': Decimal('165'),
            'city': 'Lechería',
            'state': 'Anzoátegui',
            'is_featured': True,
            'is_beachfront': True,
            'features': ['Ocean View', 'Swimming Pool', 'Tennis Court', 'Private Beach Access', '24/7 Security', 'Air Conditioning'],
        },
        {
            'title': 'Beach Apartment for Rent in Playa Parguito',
            'description': 'Fully furnished beach apartment available for monthly rent. 2 bedrooms with ocean views, perfect for surfers and beach lovers. Located near the best surf spots in Margarita.',
            'description_es': 'Apartamento de playa completamente amueblado disponible para alquiler mensual. 2 habitaciones con vista al mar, perfecto para surfistas y amantes de la playa.',
            'property_type': 'beach_apartment',
            'listing_type': 'rent',
            'price': Decimal('1200'),
            'bedrooms': 2,
            'bathrooms': Decimal('1'),
            'area_sqm': Decimal('75'),
            'city': 'Playa Parguito',
            'state': 'Nueva Esparta',
            'is_beachfront': True,
            'features': ['Ocean View', 'Furnished', 'Air Conditioning', 'Pet Friendly'],
        },

        # Beach Houses
        {
            'title': 'Exclusive Beach House in Playa Grande',
            'description': 'Magnificent 4-bedroom beach house with private pool and direct beach access. This tropical paradise features open-concept living, outdoor entertainment area, and stunning sunset views.',
            'description_es': 'Magnífica casa de playa de 4 habitaciones con piscina privada y acceso directo a la playa. Este paraíso tropical cuenta con concepto abierto, área de entretenimiento exterior y vistas espectaculares al atardecer.',
            'property_type': 'beach_house',
            'listing_type': 'sale',
            'price': Decimal('385000'),
            'bedrooms': 4,
            'bathrooms': Decimal('3.5'),
            'area_sqm': Decimal('280'),
            'lot_size': Decimal('500'),
            'city': 'Playa Grande',
            'state': 'Nueva Esparta',
            'is_featured': True,
            'is_beachfront': True,
            'features': ['Swimming Pool', 'Private Beach Access', 'Ocean View', 'BBQ Area', 'Garden', 'Air Conditioning', 'Furnished'],
        },
        {
            'title': 'Charming Beach House in Choroní',
            'description': 'Traditional Venezuelan beach house in the picturesque Choroní. 3 bedrooms, tropical garden, and walking distance to pristine beaches. Perfect weekend getaway or vacation rental.',
            'description_es': 'Casa de playa tradicional venezolana en el pintoresco Choroní. 3 habitaciones, jardín tropical y a poca distancia de playas vírgenes. Perfecta para escapadas de fin de semana.',
            'property_type': 'beach_house',
            'listing_type': 'sale',
            'price': Decimal('195000'),
            'bedrooms': 3,
            'bathrooms': Decimal('2'),
            'area_sqm': Decimal('180'),
            'city': 'Choroní',
            'state': 'Aragua',
            'is_beachfront': True,
            'features': ['Garden', 'Terrace', 'Mountain View', 'Air Conditioning'],
        },
        {
            'title': 'Modern Beach House in Puerto La Cruz',
            'description': 'Contemporary 5-bedroom beach house with infinity pool overlooking El Morro. Smart home features, chef kitchen, and private dock access. Ultimate luxury Caribbean living.',
            'description_es': 'Casa de playa contemporánea de 5 habitaciones con piscina infinita con vista a El Morro. Sistema domótico, cocina de chef y acceso a muelle privado. Lujo caribeño definitivo.',
            'property_type': 'beach_house',
            'listing_type': 'sale',
            'price': Decimal('695000'),
            'bedrooms': 5,
            'bathrooms': Decimal('5.5'),
            'area_sqm': Decimal('450'),
            'lot_size': Decimal('800'),
            'city': 'Puerto La Cruz',
            'state': 'Anzoátegui',
            'is_featured': True,
            'is_beachfront': True,
            'is_investment': True,
            'features': ['Swimming Pool', 'Ocean View', 'Smart Home System', 'Private Beach Access', 'Jacuzzi', 'Home Theater', 'Generator', '24/7 Security'],
        },

        # Villas
        {
            'title': 'Luxury Villa in Margarita Island',
            'description': 'Spectacular 6-bedroom villa with panoramic ocean views. Features include infinity pool, home theater, wine cellar, and manicured tropical gardens. Staff quarters included.',
            'description_es': 'Espectacular villa de 6 habitaciones con vistas panorámicas al océano. Incluye piscina infinita, cine en casa, cava y jardines tropicales. Habitación de servicio incluida.',
            'property_type': 'villa',
            'listing_type': 'sale',
            'price': Decimal('850000'),
            'bedrooms': 6,
            'bathrooms': Decimal('7'),
            'area_sqm': Decimal('650'),
            'lot_size': Decimal('2000'),
            'city': 'Porlamar',
            'state': 'Nueva Esparta',
            'is_featured': True,
            'is_beachfront': True,
            'features': ['Swimming Pool', 'Ocean View', 'Wine Cellar', 'Home Theater', 'Maid Quarters', 'Garden', 'Jacuzzi', '24/7 Security', 'Smart Home System'],
        },
        {
            'title': 'Mountain View Villa in Mérida',
            'description': 'Stunning villa in the Venezuelan Andes with breathtaking mountain views. 4 bedrooms, heated pool, and fireplace for cool mountain evenings. Perfect for nature lovers.',
            'description_es': 'Impresionante villa en los Andes venezolanos con vistas espectaculares a las montañas. 4 habitaciones, piscina climatizada y chimenea para las frescas noches de montaña.',
            'property_type': 'villa',
            'listing_type': 'sale',
            'price': Decimal('420000'),
            'bedrooms': 4,
            'bathrooms': Decimal('4'),
            'area_sqm': Decimal('380'),
            'lot_size': Decimal('1500'),
            'city': 'Mérida',
            'state': 'Mérida',
            'features': ['Swimming Pool', 'Mountain View', 'Garden', 'BBQ Area', 'Garage', 'Generator'],
        },
        {
            'title': 'Villa for Rent in Tucacas',
            'description': 'Beautiful 4-bedroom villa available for weekly/monthly rent. Close to Morrocoy National Park. Private pool, fully equipped, perfect for family vacations.',
            'description_es': 'Hermosa villa de 4 habitaciones disponible para alquiler semanal/mensual. Cerca del Parque Nacional Morrocoy. Piscina privada, completamente equipada.',
            'property_type': 'villa',
            'listing_type': 'rent',
            'price': Decimal('3500'),
            'bedrooms': 4,
            'bathrooms': Decimal('3'),
            'area_sqm': Decimal('300'),
            'city': 'Tucacas',
            'state': 'Falcón',
            'is_beachfront': True,
            'features': ['Swimming Pool', 'Furnished', 'Air Conditioning', 'BBQ Area', 'Pet Friendly', 'Garden'],
        },

        # Fincas / Country Estates
        {
            'title': 'Historic Cacao Finca in Barlovento',
            'description': 'Unique opportunity to own a historic 50-hectare cacao estate. Includes colonial-era main house, worker housing, processing facilities, and active cacao production. Eco-tourism potential.',
            'description_es': 'Oportunidad única de poseer una finca histórica de cacao de 50 hectáreas. Incluye casa principal de época colonial, viviendas para trabajadores, instalaciones de procesamiento y producción activa.',
            'property_type': 'finca',
            'listing_type': 'sale',
            'price': Decimal('1200000'),
            'bedrooms': 8,
            'bathrooms': Decimal('6'),
            'area_sqm': Decimal('800'),
            'lot_size': Decimal('500000'),
            'city': 'Barlovento',
            'state': 'Miranda',
            'is_investment': True,
            'features': ['Mountain View', 'Generator', 'Water Tank', 'Maid Quarters', 'Garden'],
        },
        {
            'title': 'Coffee Finca in the Andes',
            'description': 'Productive coffee estate in the Venezuelan Andes. 25 hectares with established coffee plants, modern processing equipment, and charming farmhouse. Stunning mountain scenery.',
            'description_es': 'Finca de café productiva en los Andes venezolanos. 25 hectáreas con plantas de café establecidas, equipo de procesamiento moderno y encantadora casa de campo.',
            'property_type': 'finca',
            'listing_type': 'sale',
            'price': Decimal('680000'),
            'bedrooms': 5,
            'bathrooms': Decimal('3'),
            'area_sqm': Decimal('400'),
            'lot_size': Decimal('250000'),
            'city': 'Rubio',
            'state': 'Táchira',
            'is_investment': True,
            'features': ['Mountain View', 'Generator', 'Water Tank', 'Garden'],
        },
        {
            'title': 'Luxury Ranch Estate near Valencia',
            'description': 'Magnificent 30-hectare ranch with equestrian facilities. Main residence with 6 bedrooms, guest house, stables for 20 horses, and private lake. Ultimate country living.',
            'description_es': 'Magnífico rancho de 30 hectáreas con instalaciones ecuestres. Residencia principal de 6 habitaciones, casa de huéspedes, establos para 20 caballos y lago privado.',
            'property_type': 'finca',
            'listing_type': 'sale',
            'price': Decimal('1850000'),
            'bedrooms': 6,
            'bathrooms': Decimal('6'),
            'area_sqm': Decimal('600'),
            'lot_size': Decimal('300000'),
            'city': 'Valencia',
            'state': 'Carabobo',
            'is_featured': True,
            'features': ['Swimming Pool', 'Garden', 'Maid Quarters', 'Generator', 'Water Tank', '24/7 Security'],
        },
        {
            'title': 'Eco-Lodge Finca in Gran Sabana',
            'description': 'Unique eco-tourism property near Canaima National Park. 100 hectares bordering tepui formations. Includes 8 cabins, main lodge, and established tourism business.',
            'description_es': 'Propiedad única de ecoturismo cerca del Parque Nacional Canaima. 100 hectáreas bordeando formaciones de tepuy. Incluye 8 cabañas, lodge principal y negocio turístico establecido.',
            'property_type': 'finca',
            'listing_type': 'sale',
            'price': Decimal('950000'),
            'bedrooms': 12,
            'bathrooms': Decimal('10'),
            'area_sqm': Decimal('1200'),
            'lot_size': Decimal('1000000'),
            'city': 'Santa Elena de Uairén',
            'state': 'Bolívar',
            'is_investment': True,
            'features': ['Mountain View', 'Generator', 'Water Tank', 'Garden'],
        },

        # Penthouses
        {
            'title': 'Luxury Penthouse in Las Mercedes',
            'description': 'Exceptional penthouse in Caracas most exclusive neighborhood. 4 bedrooms, private rooftop terrace with pool, 360-degree city views. Imported finishes throughout.',
            'description_es': 'Penthouse excepcional en el vecindario más exclusivo de Caracas. 4 habitaciones, terraza privada en azotea con piscina, vistas 360° a la ciudad. Acabados importados.',
            'property_type': 'penthouse',
            'listing_type': 'sale',
            'price': Decimal('520000'),
            'bedrooms': 4,
            'bathrooms': Decimal('4.5'),
            'area_sqm': Decimal('380'),
            'city': 'Caracas',
            'state': 'Distrito Capital',
            'is_featured': True,
            'features': ['Swimming Pool', 'Terrace', 'Smart Home System', 'Home Theater', 'Wine Cellar', '24/7 Security', 'Garage', 'Air Conditioning'],
        },
        {
            'title': 'Beachfront Penthouse in Porlamar',
            'description': 'Stunning duplex penthouse with unobstructed Caribbean views. 3 bedrooms, wraparound terrace, private jacuzzi, and direct elevator access. Building with full amenities.',
            'description_es': 'Impresionante penthouse dúplex con vistas despejadas al Caribe. 3 habitaciones, terraza envolvente, jacuzzi privado y acceso directo por ascensor.',
            'property_type': 'penthouse',
            'listing_type': 'sale',
            'price': Decimal('395000'),
            'bedrooms': 3,
            'bathrooms': Decimal('3.5'),
            'area_sqm': Decimal('290'),
            'city': 'Porlamar',
            'state': 'Nueva Esparta',
            'is_beachfront': True,
            'is_featured': True,
            'features': ['Ocean View', 'Jacuzzi', 'Terrace', 'Swimming Pool', 'Gym', '24/7 Security', 'Air Conditioning'],
        },
        {
            'title': 'Modern Penthouse in Valencia',
            'description': 'Contemporary penthouse in premium Valencia location. 3 bedrooms, floor-to-ceiling windows, chef kitchen, and spectacular sunset views over the mountains.',
            'description_es': 'Penthouse contemporáneo en ubicación premium de Valencia. 3 habitaciones, ventanales del piso al techo, cocina de chef y vistas espectaculares del atardecer.',
            'property_type': 'penthouse',
            'listing_type': 'sale',
            'price': Decimal('285000'),
            'bedrooms': 3,
            'bathrooms': Decimal('3'),
            'area_sqm': Decimal('245'),
            'city': 'Valencia',
            'state': 'Carabobo',
            'features': ['Mountain View', 'Terrace', 'Gym', '24/7 Security', 'Garage', 'Air Conditioning'],
        },

        # Houses
        {
            'title': 'Colonial House in Coro Historic Center',
            'description': 'Beautifully restored colonial house in UNESCO World Heritage site. 4 bedrooms around traditional courtyard, original tile floors, and modern amenities. Unique investment.',
            'description_es': 'Casa colonial bellamente restaurada en sitio Patrimonio de la Humanidad. 4 habitaciones alrededor de patio tradicional, pisos de baldosas originales y amenidades modernas.',
            'property_type': 'house',
            'listing_type': 'sale',
            'price': Decimal('225000'),
            'bedrooms': 4,
            'bathrooms': Decimal('3'),
            'area_sqm': Decimal('320'),
            'city': 'Coro',
            'state': 'Falcón',
            'features': ['Garden', 'Terrace', 'Air Conditioning'],
        },
        {
            'title': 'Modern Family Home in El Hatillo',
            'description': 'Contemporary 5-bedroom home in Caracas most family-friendly area. Open floor plan, large pool, and mature garden. Top schools nearby.',
            'description_es': 'Casa contemporánea de 5 habitaciones en la zona más familiar de Caracas. Planta abierta, gran piscina y jardín maduro. Mejores colegios cerca.',
            'property_type': 'house',
            'listing_type': 'sale',
            'price': Decimal('380000'),
            'bedrooms': 5,
            'bathrooms': Decimal('4'),
            'area_sqm': Decimal('400'),
            'lot_size': Decimal('800'),
            'city': 'El Hatillo',
            'state': 'Miranda',
            'features': ['Swimming Pool', 'Garden', 'Garage', 'Maid Quarters', '24/7 Security', 'BBQ Area'],
        },
        {
            'title': 'Affordable Home in Barquisimeto',
            'description': 'Well-maintained 3-bedroom home in quiet Barquisimeto neighborhood. Recent renovations, covered parking, and small garden. Great starter home.',
            'description_es': 'Casa de 3 habitaciones bien mantenida en tranquilo vecindario de Barquisimeto. Renovaciones recientes, estacionamiento techado y pequeño jardín.',
            'property_type': 'house',
            'listing_type': 'sale',
            'price': Decimal('85000'),
            'bedrooms': 3,
            'bathrooms': Decimal('2'),
            'area_sqm': Decimal('160'),
            'city': 'Barquisimeto',
            'state': 'Lara',
            'features': ['Garage', 'Garden', 'Air Conditioning'],
        },

        # Apartments
        {
            'title': 'Luxury Apartment in Altamira',
            'description': 'Elegant 3-bedroom apartment in prestigious Altamira location. High ceilings, marble floors, and designer finishes. Building with pool, gym, and social areas.',
            'description_es': 'Elegante apartamento de 3 habitaciones en prestigiosa ubicación de Altamira. Techos altos, pisos de mármol y acabados de diseñador.',
            'property_type': 'apartment',
            'listing_type': 'sale',
            'price': Decimal('195000'),
            'bedrooms': 3,
            'bathrooms': Decimal('2.5'),
            'area_sqm': Decimal('180'),
            'city': 'Caracas',
            'state': 'Distrito Capital',
            'features': ['Swimming Pool', 'Gym', '24/7 Security', 'Garage', 'Air Conditioning'],
        },
        {
            'title': 'Investment Apartment in Maracaibo',
            'description': 'Modern 2-bedroom apartment ideal for rental income. New construction, contemporary design, and low maintenance fees. Growing neighborhood.',
            'description_es': 'Apartamento moderno de 2 habitaciones ideal para renta. Nueva construcción, diseño contemporáneo y bajos gastos de condominio.',
            'property_type': 'apartment',
            'listing_type': 'sale',
            'price': Decimal('68000'),
            'bedrooms': 2,
            'bathrooms': Decimal('2'),
            'area_sqm': Decimal('85'),
            'city': 'Maracaibo',
            'state': 'Zulia',
            'is_investment': True,
            'features': ['Balcony', 'Air Conditioning', 'Garage'],
        },
        {
            'title': 'Studio for Rent in Caracas',
            'description': 'Fully furnished studio in central Caracas. Perfect for professionals. Includes utilities, internet, and building amenities.',
            'description_es': 'Estudio completamente amueblado en el centro de Caracas. Perfecto para profesionales. Incluye servicios, internet y amenidades del edificio.',
            'property_type': 'apartment',
            'listing_type': 'rent',
            'price': Decimal('450'),
            'bedrooms': 1,
            'bathrooms': Decimal('1'),
            'area_sqm': Decimal('45'),
            'city': 'Caracas',
            'state': 'Distrito Capital',
            'features': ['Furnished', 'Air Conditioning', '24/7 Security'],
        },

        # Townhouses
        {
            'title': 'Modern Townhouse in Valencia',
            'description': 'Contemporary 4-bedroom townhouse in gated community. Private garden, modern kitchen, and community amenities including pool and playground.',
            'description_es': 'Casa adosada contemporánea de 4 habitaciones en comunidad cerrada. Jardín privado, cocina moderna y amenidades comunitarias.',
            'property_type': 'townhouse',
            'listing_type': 'sale',
            'price': Decimal('155000'),
            'bedrooms': 4,
            'bathrooms': Decimal('3.5'),
            'area_sqm': Decimal('220'),
            'city': 'Valencia',
            'state': 'Carabobo',
            'features': ['Garden', 'Swimming Pool', '24/7 Security', 'Garage', 'Air Conditioning'],
        },
        {
            'title': 'Townhouse in La Asunción',
            'description': '3-bedroom townhouse in charming La Asunción, Margarita Island. Close to historic center and beaches. Great vacation home or rental property.',
            'description_es': 'Casa adosada de 3 habitaciones en el encantador La Asunción, Isla Margarita. Cerca del centro histórico y playas. Excelente casa vacacional.',
            'property_type': 'townhouse',
            'listing_type': 'sale',
            'price': Decimal('125000'),
            'bedrooms': 3,
            'bathrooms': Decimal('2.5'),
            'area_sqm': Decimal('180'),
            'city': 'La Asunción',
            'state': 'Nueva Esparta',
            'features': ['Garden', 'Garage', 'Air Conditioning'],
        },

        # Commercial
        {
            'title': 'Boutique Hotel in Colonia Tovar',
            'description': 'Charming 12-room boutique hotel in the German-style village of Colonia Tovar. Includes restaurant, established clientele, and beautiful mountain setting.',
            'description_es': 'Encantador hotel boutique de 12 habitaciones en la aldea estilo alemán de Colonia Tovar. Incluye restaurante, clientela establecida y hermoso entorno montañoso.',
            'property_type': 'commercial',
            'listing_type': 'sale',
            'price': Decimal('580000'),
            'bedrooms': 12,
            'bathrooms': Decimal('12'),
            'area_sqm': Decimal('800'),
            'city': 'Colonia Tovar',
            'state': 'Aragua',
            'is_investment': True,
            'features': ['Mountain View', 'Garden', 'Generator', 'Water Tank'],
        },
        {
            'title': 'Prime Retail Space in Maracaibo',
            'description': 'Street-level retail space in high-traffic Maracaibo location. 200 sqm with storage basement. Ideal for restaurant or retail business.',
            'description_es': 'Local comercial a nivel de calle en ubicación de alto tráfico en Maracaibo. 200 m2 con sótano de almacenamiento. Ideal para restaurante o negocio minorista.',
            'property_type': 'commercial',
            'listing_type': 'rent',
            'price': Decimal('2800'),
            'bedrooms': 0,
            'bathrooms': Decimal('2'),
            'area_sqm': Decimal('200'),
            'city': 'Maracaibo',
            'state': 'Zulia',
            'features': ['Air Conditioning'],
        },

        # Land
        {
            'title': 'Beachfront Development Land in Chichiriviche',
            'description': '5,000 sqm beachfront plot perfect for hotel or residential development. All permits in place. Adjacent to Morrocoy National Park.',
            'description_es': 'Terreno frente al mar de 5,000 m2 perfecto para desarrollo hotelero o residencial. Todos los permisos en regla. Adyacente al Parque Nacional Morrocoy.',
            'property_type': 'land',
            'listing_type': 'sale',
            'price': Decimal('450000'),
            'bedrooms': 0,
            'bathrooms': Decimal('0'),
            'area_sqm': Decimal('5000'),
            'city': 'Chichiriviche',
            'state': 'Falcón',
            'is_beachfront': True,
            'is_investment': True,
            'features': ['Ocean View', 'Private Beach Access'],
        },
        {
            'title': 'Mountain View Lot in Galipán',
            'description': '2,000 sqm lot with spectacular Caracas and Caribbean views in exclusive Galipán area. Perfect for luxury home construction.',
            'description_es': 'Lote de 2,000 m2 con vistas espectaculares a Caracas y el Caribe en exclusiva zona de Galipán. Perfecto para construcción de casa de lujo.',
            'property_type': 'land',
            'listing_type': 'sale',
            'price': Decimal('185000'),
            'bedrooms': 0,
            'bathrooms': Decimal('0'),
            'area_sqm': Decimal('2000'),
            'city': 'Galipán',
            'state': 'Vargas',
            'features': ['Mountain View', 'Ocean View'],
        },
    ]

    def handle(self, *args, **options):
        self.stdout.write('Creating sample agents and companies...')

        # Create a real estate company
        company, created = User.objects.get_or_create(
            email='info@viventave.com',
            defaults={
                'first_name': '',
                'last_name': '',
                'role': 'agent',
                'agent_type': 'company',
                'phone': '+58 212 555 0100',
                'company_name': 'Viventa Premium Properties',
                'bio': 'Leading real estate company specializing in luxury vacation properties across Venezuela. With over 15 years of experience, we connect international investors with prime Venezuelan real estate.',
                'bio_es': 'Empresa inmobiliaria líder especializada en propiedades vacacionales de lujo en toda Venezuela. Con más de 15 años de experiencia, conectamos inversores internacionales con bienes raíces venezolanos de primera categoría.',
                'is_verified_agent': True,
                'city': 'Caracas',
                'state': 'Distrito Capital',
                'website': 'https://viventa.ve',
                'founded_year': 2009,
                'team_size': 15,
                'whatsapp': '+58 412 555 0100',
                'instagram': 'viventa_ve',
                'total_listings': 45,
                'total_sales': 120,
                'avatar_url': 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&auto=format',  # Company building
            }
        )
        if created:
            company.set_password('company123')
            company.save()
            self.stdout.write(self.style.SUCCESS(f'Created company: {company.company_name}'))

        # Create a beachfront specialist company
        beach_company, created = User.objects.get_or_create(
            email='carlos@marinorealty.ve',
            defaults={
                'first_name': 'Carlos',
                'last_name': 'Marino',
                'role': 'agent',
                'agent_type': 'company',
                'phone': '+58 414 555 0200',
                'company_name': 'Marino Beach Realty',
                'bio': 'Beachfront real estate company with expertise in coastal properties in Nueva Esparta. Helping international clients find their dream vacation homes in Margarita Island for over 20 years.',
                'bio_es': 'Compañía inmobiliaria especializada en propiedades costeras en Nueva Esparta. Ayudando a clientes internacionales a encontrar su casa vacacional soñada en Isla Margarita por más de 20 años.',
                'is_verified_agent': True,
                'city': 'Porlamar',
                'state': 'Nueva Esparta',
                'website': 'https://marinobeachrealty.ve',
                'whatsapp': '+58 414 555 0200',
                'instagram': 'marino_beach_realty',
                'total_listings': 32,
                'total_sales': 95,
                'avatar_url': self.AGENT_PHOTOS[0],  # Business man
            }
        )
        if created:
            beach_company.set_password('company123')
            beach_company.save()
            self.stdout.write(self.style.SUCCESS(f'Created company: {beach_company.company_name}'))

        # Create individual agents
        agents_data = [
            {
                'email': 'maria@viventave.com',
                'first_name': 'María',
                'last_name': 'Rodríguez',
                'phone': '+58 412 555 0123',
                'bio': 'Professional real estate agent with 10+ years of experience. Specializing in urban apartments and penthouses in Caracas.',
                'bio_es': 'Agente inmobiliario profesional con más de 10 años de experiencia. Especializada en apartamentos urbanos y penthouses en Caracas.',
                'city': 'Caracas',
                'state': 'Distrito Capital',
                'parent_company': company,
                'instagram': 'maria_rodriguez_realty',
                'total_listings': 18,
                'total_sales': 42,
                'avatar_url': self.AGENT_PHOTOS[1],  # Business woman
            },
            {
                'email': 'pedro@viventave.com',
                'first_name': 'Pedro',
                'last_name': 'González',
                'phone': '+58 416 555 0300',
                'bio': 'Expert in fincas and country estates. Deep knowledge of agricultural properties in Táchira and Mérida.',
                'bio_es': 'Experto en fincas y propiedades rurales. Amplio conocimiento de propiedades agrícolas en Táchira y Mérida.',
                'city': 'San Cristóbal',
                'state': 'Táchira',
                'parent_company': company,
                'instagram': 'pedro_fincas',
                'total_listings': 12,
                'total_sales': 28,
                'avatar_url': self.AGENT_PHOTOS[2],  # Man casual
            },
            {
                'email': 'lucia@margaritaproperties.ve',
                'first_name': 'Lucía',
                'last_name': 'Martínez',
                'phone': '+58 424 555 0400',
                'bio': 'Margarita Island native specializing in beach apartments and vacation rentals. Fluent in English and Italian.',
                'bio_es': 'Nativa de Isla Margarita especializada en apartamentos de playa y alquileres vacacionales. Habla inglés e italiano.',
                'city': 'Pampatar',
                'state': 'Nueva Esparta',
                'parent_company': None,
                'instagram': 'lucia_margarita_realty',
                'total_listings': 24,
                'total_sales': 56,
                'avatar_url': self.AGENT_PHOTOS[3],  # Woman professional
            },
            {
                'email': 'andres@valenciahomes.ve',
                'first_name': 'Andrés',
                'last_name': 'Mendoza',
                'phone': '+58 414 555 0500',
                'bio': 'Valencia real estate specialist. Expertise in family homes, townhouses, and investment properties in Carabobo.',
                'bio_es': 'Especialista en bienes raíces de Valencia. Experto en casas familiares, townhouses y propiedades de inversión en Carabobo.',
                'city': 'Valencia',
                'state': 'Carabobo',
                'parent_company': None,
                'instagram': 'andres_valencia_homes',
                'total_listings': 15,
                'total_sales': 38,
                'avatar_url': self.AGENT_PHOTOS[4],  # Man smiling
            },
        ]

        created_agents = []
        for agent_data in agents_data:
            parent = agent_data.pop('parent_company')
            agent, created = User.objects.get_or_create(
                email=agent_data['email'],
                defaults={
                    **agent_data,
                    'role': 'agent',
                    'agent_type': 'individual',
                    'is_verified_agent': True,
                    'parent_company': parent,
                    'whatsapp': agent_data['phone'],
                }
            )
            if created:
                agent.set_password('agent123')
                agent.save()
                self.stdout.write(self.style.SUCCESS(f'Created agent: {agent.full_name}'))
            created_agents.append(agent)

        # All agents for property assignment
        all_agents = [company, beach_company] + created_agents

        # Create properties
        self.stdout.write('\nCreating sample properties...')

        for i, prop_data in enumerate(self.SAMPLE_PROPERTIES):
            # Check if property already exists
            existing = Property.objects.filter(title=prop_data['title']).first()
            if existing:
                self.stdout.write(f'Property already exists: {prop_data["title"][:50]}...')
                continue

            # Generate address
            address = f'{random.randint(100, 9999)} {random.choice(["Av.", "Calle", "Urb.", "Sector"])} {random.choice(["Principal", "Bolívar", "Miranda", "Sucre", "Los Mangos", "Las Flores", "El Sol", "La Playa", "Vista Mar"])}'

            # Assign to appropriate agent based on property type/location
            if 'Nueva Esparta' in prop_data['state']:
                agent = random.choice([beach_company, created_agents[2]])  # Beach specialists
            elif prop_data['property_type'] == 'finca':
                agent = created_agents[1]  # Pedro - finca specialist
            elif 'Carabobo' in prop_data['state']:
                agent = created_agents[3]  # Andrés - Valencia specialist
            else:
                agent = random.choice(all_agents)

            property_obj = Property.objects.create(
                title=prop_data['title'],
                description=prop_data['description'],
                description_es=prop_data.get('description_es', ''),
                property_type=prop_data['property_type'],
                listing_type=prop_data['listing_type'],
                status=PropertyStatus.ACTIVE,
                price=prop_data['price'],
                bedrooms=prop_data['bedrooms'],
                bathrooms=prop_data['bathrooms'],
                area_sqm=prop_data['area_sqm'],
                lot_size_sqm=prop_data.get('lot_size'),
                address=address,
                city=prop_data['city'],
                state=prop_data['state'],
                country='Venezuela',
                agent=agent,
                is_featured=prop_data.get('is_featured', False),
                is_beachfront=prop_data.get('is_beachfront', False),
                is_investment_opportunity=prop_data.get('is_investment', False),
                features=prop_data.get('features', []),
                year_built=random.choice([None, 2015, 2018, 2020, 2022, 2023]),
                parking_spaces=random.randint(1, 4) if prop_data['bedrooms'] > 0 else 0,
            )

            # Get appropriate images based on property type
            type_to_images = {
                'beach_apartment': ['beach', 'apartment', 'interior', 'pool'],
                'beach_house': ['beach', 'villa', 'pool', 'interior'],
                'villa': ['villa', 'pool', 'interior', 'beach'],
                'finca': ['finca', 'house', 'interior'],
                'penthouse': ['penthouse', 'interior', 'pool'],
                'house': ['house', 'interior', 'pool'],
                'apartment': ['apartment', 'interior'],
                'townhouse': ['house', 'interior', 'pool'],
                'commercial': ['commercial'],
                'land': ['land', 'beach'],
            }

            image_categories = type_to_images.get(prop_data['property_type'], ['villa', 'interior'])

            # Collect images from relevant categories
            available_images = []
            for cat in image_categories:
                if cat in self.PROPERTY_IMAGES:
                    available_images.extend(self.PROPERTY_IMAGES[cat])

            # Remove duplicates and select 4-6 images
            available_images = list(set(available_images))
            num_images = min(random.randint(4, 6), len(available_images))
            selected_images = random.sample(available_images, num_images)

            for j, img_url in enumerate(selected_images):
                PropertyImage.objects.create(
                    property=property_obj,
                    image_url=img_url,
                    is_main=(j == 0),
                    order=j,
                )

            self.stdout.write(self.style.SUCCESS(f'Created: {property_obj.title[:60]}...'))

        total_properties = Property.objects.count()
        total_agents = User.objects.filter(role='agent').count()

        self.stdout.write('')
        self.stdout.write(self.style.SUCCESS(f'Database seeded successfully!'))
        self.stdout.write(self.style.SUCCESS(f'Total properties: {total_properties}'))
        self.stdout.write(self.style.SUCCESS(f'Total agents: {total_agents}'))
