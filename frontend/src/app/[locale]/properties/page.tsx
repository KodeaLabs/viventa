import { getTranslations } from 'next-intl/server';
import { SearchBar, FilterPanel } from '@/components/molecules';
import { PropertyGrid } from '@/components/organisms';
import { api } from '../../../lib/api';
import type { Property } from '@/types';

interface PropertiesPageProps {
  params: { locale: string };
  searchParams: {
    search?: string;
    property_type?: string;
    city?: string;
    state?: string;
    min_price?: string;
    max_price?: string;
    min_bedrooms?: string;
    is_featured?: string;
    is_beachfront?: string;
    page?: string;
  };
}

export default async function PropertiesPage({
  params: { locale },
  searchParams,
}: PropertiesPageProps) {
  const t = await getTranslations({ locale, namespace: 'property' });
  const searchT = await getTranslations({ locale, namespace: 'search' });
  const filterT = await getTranslations({ locale, namespace: 'filter' });

  // Build filters from search params
  const filters: Record<string, any> = {};
  if (searchParams.search) filters.search = searchParams.search;
  if (searchParams.property_type) filters.property_type = searchParams.property_type;
  if (searchParams.city) filters.city = searchParams.city;
  if (searchParams.state) filters.state = searchParams.state;
  if (searchParams.min_price) filters.min_price = searchParams.min_price;
  if (searchParams.max_price) filters.max_price = searchParams.max_price;
  if (searchParams.min_bedrooms) filters.min_bedrooms = searchParams.min_bedrooms;
  if (searchParams.is_featured) filters.is_featured = searchParams.is_featured;
  if (searchParams.is_beachfront) filters.is_beachfront = searchParams.is_beachfront;
  if (searchParams.page) filters.page = searchParams.page;

  // Fetch properties
  let properties: Property[] = [];
  let meta = null;
  try {
    const response = await api.getProperties(filters);
    properties = response.data || [];
    meta = response.meta;
  } catch (error) {
    console.error('Failed to fetch properties:', error);
  }

  const searchTranslations = {
    searchPlaceholder: searchT('placeholder'),
    allTypes: searchT('allTypes'),
    search: searchT('search'),
    location: searchT('location'),
    propertyType: locale === 'es' ? 'Tipo de Propiedad' : 'Property Type',
  };

  const propertyTranslations = {
    bedrooms: t('bedrooms'),
    bathrooms: t('bathrooms'),
    beachfront: t('beachfront'),
    featured: t('featured'),
    investment: t('investment'),
    noProperties: t('noProperties'),
  };

  const filterTranslations = {
    filters: filterT('filters'),
    clearAll: filterT('clearAll'),
    apply: filterT('apply'),
    propertyType: filterT('propertyType'),
    allTypes: filterT('allTypes'),
    priceRange: filterT('priceRange'),
    minPrice: filterT('minPrice'),
    maxPrice: filterT('maxPrice'),
    bedrooms: filterT('bedrooms'),
    anyBedrooms: filterT('anyBedrooms'),
    location: filterT('location'),
    allLocations: filterT('allLocations'),
    features: filterT('features'),
    beachfront: filterT('beachfront'),
    featured: filterT('featured'),
  };

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Header */}
      <div className="bg-white border-b border-secondary-100">
        <div className="container-custom py-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-secondary-900 mb-6">
            {locale === 'en' ? 'Properties' : 'Propiedades'}
          </h1>
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
            <div className="flex-1 w-full">
              <SearchBar variant="hero" locale={locale} translations={searchTranslations} />
            </div>
            <FilterPanel locale={locale} translations={filterTranslations} />
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="container-custom py-8 md:py-12">
        {/* Results count */}
        {meta && (
          <p className="text-secondary-600 mb-6">
            {locale === 'en'
              ? `Showing ${properties.length} of ${meta.total_count} properties`
              : `Mostrando ${properties.length} de ${meta.total_count} propiedades`}
          </p>
        )}

        <PropertyGrid
          properties={properties}
          locale={locale}
          translations={propertyTranslations}
        />

        {/* Pagination */}
        {meta && meta.total_pages > 1 && (
          <div className="mt-12 flex justify-center gap-2">
            {Array.from({ length: meta.total_pages }, (_, i) => i + 1).map((page) => (
              <a
                key={page}
                href={`/${locale}/properties?${new URLSearchParams({
                  ...searchParams,
                  page: String(page),
                }).toString()}`}
                className={`px-4 py-2 rounded-lg ${
                  page === meta.page
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-secondary-600 hover:bg-secondary-100'
                }`}
              >
                {page}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
