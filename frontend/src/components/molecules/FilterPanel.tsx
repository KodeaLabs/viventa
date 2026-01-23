'use client';

import { useState, Suspense } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { ChevronDownIcon, XMarkIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import { Button, Select, Spinner } from '@/components/atoms';
import { venezuelanStates, propertyTypeLabels } from '../../lib/utils';

interface FilterPanelProps {
  locale: string;
  translations: {
    filters: string;
    clearAll: string;
    apply: string;
    propertyType: string;
    allTypes: string;
    priceRange: string;
    minPrice: string;
    maxPrice: string;
    bedrooms: string;
    anyBedrooms: string;
    location: string;
    allLocations: string;
    features: string;
    beachfront: string;
    featured: string;
  };
}

function FilterPanelInner({ locale, translations }: FilterPanelProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  const currentFilters = {
    property_type: searchParams.get('property_type') || '',
    min_price: searchParams.get('min_price') || '',
    max_price: searchParams.get('max_price') || '',
    min_bedrooms: searchParams.get('min_bedrooms') || '',
    state: searchParams.get('state') || '',
    is_beachfront: searchParams.get('is_beachfront') || '',
    is_featured: searchParams.get('is_featured') || '',
  };

  const [filters, setFilters] = useState(currentFilters);

  const propertyTypes = Object.entries(propertyTypeLabels).map(([value, labels]) => ({
    value,
    label: labels[locale as 'en' | 'es'],
  }));

  const bedroomOptions = [
    { value: '', label: translations.anyBedrooms },
    { value: '1', label: '1+' },
    { value: '2', label: '2+' },
    { value: '3', label: '3+' },
    { value: '4', label: '4+' },
    { value: '5', label: '5+' },
  ];

  const stateOptions = [
    { value: '', label: translations.allLocations },
    ...venezuelanStates.map((state) => ({ value: state, label: state })),
  ];

  const handleApply = () => {
    const params = new URLSearchParams(searchParams.toString());

    // Validate price range
    const minPrice = filters.min_price ? Number(filters.min_price) : null;
    const maxPrice = filters.max_price ? Number(filters.max_price) : null;

    if (minPrice !== null && maxPrice !== null && minPrice > maxPrice) {
      // Swap values if min > max
      const validatedFilters = {
        ...filters,
        min_price: filters.max_price,
        max_price: filters.min_price,
      };
      setFilters(validatedFilters);
      Object.entries(validatedFilters).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });
    } else {
      // Remove empty values, add non-empty ones
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });
    }

    // Reset to page 1 when filters change
    params.delete('page');

    router.push(`${pathname}?${params.toString()}`);
    setIsOpen(false);
  };

  const handleClear = () => {
    setFilters({
      property_type: '',
      min_price: '',
      max_price: '',
      min_bedrooms: '',
      state: '',
      is_beachfront: '',
      is_featured: '',
    });

    router.push(pathname);
    setIsOpen(false);
  };

  const activeFilterCount = Object.values(currentFilters).filter(Boolean).length;

  return (
    <div className="relative">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2.5 bg-white border border-secondary-200 rounded-lg hover:bg-secondary-50 transition-colors"
      >
        <AdjustmentsHorizontalIcon className="h-5 w-5 text-secondary-600" />
        <span className="font-medium text-secondary-700">{translations.filters}</span>
        {activeFilterCount > 0 && (
          <span className="px-2 py-0.5 bg-primary-100 text-primary-700 text-xs font-semibold rounded-full">
            {activeFilterCount}
          </span>
        )}
        <ChevronDownIcon
          className={`h-4 w-4 text-secondary-400 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Filter Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/20 md:hidden"
            onClick={() => setIsOpen(false)}
          />

          {/* Panel */}
          <div className="absolute right-0 top-full mt-2 w-full sm:w-96 bg-white rounded-xl shadow-elegant z-50 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-secondary-100">
              <h3 className="font-semibold text-secondary-900">{translations.filters}</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-secondary-100 rounded-lg"
              >
                <XMarkIcon className="h-5 w-5 text-secondary-500" />
              </button>
            </div>

            {/* Filters */}
            <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
              {/* Property Type */}
              <Select
                label={translations.propertyType}
                options={[
                  { value: '', label: translations.allTypes },
                  ...propertyTypes,
                ]}
                value={filters.property_type}
                onChange={(e) =>
                  setFilters({ ...filters, property_type: e.target.value })
                }
              />

              {/* Price Range */}
              <div>
                <label className="label">{translations.priceRange}</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder={translations.minPrice}
                    className="input flex-1"
                    value={filters.min_price}
                    onChange={(e) =>
                      setFilters({ ...filters, min_price: e.target.value })
                    }
                  />
                  <input
                    type="number"
                    placeholder={translations.maxPrice}
                    className="input flex-1"
                    value={filters.max_price}
                    onChange={(e) =>
                      setFilters({ ...filters, max_price: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Bedrooms */}
              <Select
                label={translations.bedrooms}
                options={bedroomOptions}
                value={filters.min_bedrooms}
                onChange={(e) =>
                  setFilters({ ...filters, min_bedrooms: e.target.value })
                }
              />

              {/* Location */}
              <Select
                label={translations.location}
                options={stateOptions}
                value={filters.state}
                onChange={(e) => setFilters({ ...filters, state: e.target.value })}
              />

              {/* Features */}
              <div>
                <label className="label">{translations.features}</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                      checked={filters.is_beachfront === 'true'}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          is_beachfront: e.target.checked ? 'true' : '',
                        })
                      }
                    />
                    <span className="text-secondary-700">{translations.beachfront}</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                      checked={filters.is_featured === 'true'}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          is_featured: e.target.checked ? 'true' : '',
                        })
                      }
                    />
                    <span className="text-secondary-700">{translations.featured}</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-secondary-100 bg-secondary-50">
              <button
                onClick={handleClear}
                className="text-sm font-medium text-secondary-600 hover:text-secondary-900"
              >
                {translations.clearAll}
              </button>
              <Button onClick={handleApply}>{translations.apply}</Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// Wrapper component with Suspense for SSR compatibility
export function FilterPanel(props: FilterPanelProps) {
  return (
    <Suspense
      fallback={
        <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-secondary-200 rounded-lg">
          <Spinner size="sm" />
          <span className="font-medium text-secondary-700">{props.translations.filters}</span>
        </button>
      }
    >
      <FilterPanelInner {...props} />
    </Suspense>
  );
}
