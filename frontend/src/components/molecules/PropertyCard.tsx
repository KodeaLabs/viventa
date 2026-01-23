'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  HomeIcon,
  MapPinIcon,
  ArrowsPointingOutIcon,
  HeartIcon,
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { Badge } from '@/components/atoms';
import { formatPrice } from '../../lib/api';
import { cn } from '../../lib/utils';
import type { Property } from '@/types';

interface PropertyCardProps {
  property: Property;
  locale: string;
  translations: {
    bedrooms: string;
    bathrooms: string;
    beachfront: string;
    featured: string;
    investment: string;
  };
  onSave?: (id: string) => void;
  isSaved?: boolean;
}

export function PropertyCard({
  property,
  locale,
  translations,
  onSave,
  isSaved = false,
}: PropertyCardProps) {
  const imageUrl = property.main_image || '/images/placeholder-property.jpg';

  return (
    <Link href={`/${locale}/properties/${property.slug}`} className="block">
      <article className="card group cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden rounded-t-xl">
          <Image
            src={imageUrl}
            alt={property.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />

          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Top Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
            {property.is_featured && (
              <Badge variant="warning">{translations.featured}</Badge>
            )}
            {property.is_beachfront && (
              <Badge variant="success">{translations.beachfront}</Badge>
            )}
            {property.is_investment_opportunity && (
              <Badge variant="secondary">{translations.investment}</Badge>
            )}
          </div>

          {/* Save Button */}
          {onSave && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onSave(property.id);
              }}
              className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white transition-colors z-10"
              aria-label={isSaved ? 'Remove from saved' : 'Save property'}
            >
              {isSaved ? (
                <HeartIconSolid className="h-5 w-5 text-red-500" />
              ) : (
                <HeartIcon className="h-5 w-5 text-secondary-600" />
              )}
            </button>
          )}

          {/* Price */}
          <div className="absolute bottom-3 left-3">
            <p className="text-2xl font-bold text-white">
              {formatPrice(property.price)}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-display text-lg font-semibold text-secondary-900 line-clamp-1 group-hover:text-primary-600 transition-colors">
            {property.title}
          </h3>

          <div className="flex items-center mt-2 text-secondary-500">
            <MapPinIcon className="h-4 w-4 mr-1 flex-shrink-0" />
            <span className="text-sm line-clamp-1">{property.location_display}</span>
          </div>

          {/* Features */}
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-secondary-100">
            <div className="flex items-center text-secondary-600">
              <HomeIcon className="h-4 w-4 mr-1 flex-shrink-0" />
              <span className="text-sm">
                {property.bedrooms} {translations.bedrooms}
              </span>
            </div>
            <div className="flex items-center text-secondary-600">
              {/* Bath/Shower icon */}
              <svg
                className="h-4 w-4 mr-1 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 12h16M4 12a2 2 0 00-2 2v4a2 2 0 002 2h16a2 2 0 002-2v-4a2 2 0 00-2-2M4 12V8a4 4 0 014-4h1"
                />
              </svg>
              <span className="text-sm">
                {Math.floor(property.bathrooms)} {translations.bathrooms}
              </span>
            </div>
            {property.area_sqm && (
              <div className="flex items-center text-secondary-600">
                <ArrowsPointingOutIcon className="h-4 w-4 mr-1 flex-shrink-0" />
                <span className="text-sm">{property.area_sqm} m²</span>
              </div>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
