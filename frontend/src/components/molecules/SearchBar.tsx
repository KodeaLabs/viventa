'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MagnifyingGlassIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { Button, Select } from '@/components/atoms';
import { propertyTypeLabels } from '../../lib/utils';

interface SearchBarProps {
  variant?: 'hero' | 'compact';
  className?: string;
  locale?: string;
  translations: {
    searchPlaceholder: string;
    allTypes: string;
    search: string;
    location: string;
    propertyType: string;
  };
}

export function SearchBar({ variant = 'hero', locale: propLocale, translations }: SearchBarProps) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [location, setLocation] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (propertyType) params.set('property_type', propertyType);
    if (location) params.set('city', location);
    // Get current locale from pathname or prop
    const pathLocale = window.location.pathname.split('/')[1];
    const locale = propLocale || (pathLocale === 'es' ? 'es' : 'en');
    router.push(`/${locale}/properties?${params.toString()}`);
  };

  const propertyTypes = Object.entries(propertyTypeLabels).map(([value, labels]) => ({
    value,
    label: labels[propLocale as 'en' | 'es'] || labels.en,
  }));

  if (variant === 'compact') {
    return (
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-secondary-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={translations.searchPlaceholder}
            className="input pl-10"
          />
        </div>
        <Button type="submit">{translations.search}</Button>
      </form>
    );
  }

  return (
    <form
      onSubmit={handleSearch}
      className="bg-white rounded-2xl shadow-elegant p-4 md:p-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search Input */}
        <div className="md:col-span-2">
          <label className="label">{translations.searchPlaceholder}</label>
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-secondary-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={translations.searchPlaceholder}
              className="input pl-10"
            />
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="label">{translations.location}</label>
          <div className="relative">
            <MapPinIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-secondary-400 z-10" />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Margarita, Caracas..."
              className="input pl-10"
            />
          </div>
        </div>

        {/* Property Type */}
        <div>
          <label className="label">{translations.propertyType}</label>
          <Select
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
            options={[
              { value: '', label: translations.allTypes },
              ...propertyTypes,
            ]}
          />
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <Button type="submit" size="lg" className="w-full md:w-auto">
          <MagnifyingGlassIcon className="h-5 w-5 mr-2" />
          {translations.search}
        </Button>
      </div>
    </form>
  );
}
