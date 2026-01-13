'use client';

import { PropertyCard } from '@/components/molecules';
import { PropertyGridSkeleton, EmptyState } from '@/components/atoms';
import type { Property } from '@/types';

interface PropertyGridProps {
  properties: Property[];
  locale: string;
  translations: {
    bedrooms: string;
    bathrooms: string;
    forSale: string;
    forRent: string;
    beachfront: string;
    featured: string;
    investment: string;
    noProperties: string;
  };
  isLoading?: boolean;
  onSave?: (id: string) => void;
  savedPropertyIds?: string[];
}

export function PropertyGrid({
  properties,
  locale,
  translations,
  isLoading,
  onSave,
  savedPropertyIds = [],
}: PropertyGridProps) {
  if (isLoading) {
    return <PropertyGridSkeleton count={6} />;
  }

  if (properties.length === 0) {
    return (
      <EmptyState
        variant="search"
        title={locale === 'es' ? 'No se encontraron propiedades' : 'No Properties Found'}
        description={translations.noProperties}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property) => (
        <PropertyCard
          key={property.id}
          property={property}
          locale={locale}
          translations={translations}
          onSave={onSave}
          isSaved={savedPropertyIds.includes(property.id)}
        />
      ))}
    </div>
  );
}
