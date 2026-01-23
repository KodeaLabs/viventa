'use client';

import { useState } from 'react';
import { AssetCard } from '../molecules/AssetCard';
import type { SellableAsset, AssetType } from '@/types';

interface AssetGridProps {
  assets: SellableAsset[];
  locale: string;
}

const typeFilters: { key: AssetType | 'all'; label: { en: string; es: string } }[] = [
  { key: 'all', label: { en: 'All', es: 'Todos' } },
  { key: 'apartment', label: { en: 'Apartments', es: 'Apartamentos' } },
  { key: 'parking', label: { en: 'Parking', es: 'Estacionamiento' } },
  { key: 'storage', label: { en: 'Storage', es: 'Maleteros' } },
  { key: 'commercial', label: { en: 'Commercial', es: 'Comercial' } },
  { key: 'land_lot', label: { en: 'Land Lots', es: 'Lotes' } },
];

export function AssetGrid({ assets, locale }: AssetGridProps) {
  const [activeFilter, setActiveFilter] = useState<AssetType | 'all'>('all');
  const lang = locale === 'es' ? 'es' : 'en';

  const filteredAssets = activeFilter === 'all'
    ? assets
    : assets.filter((a) => a.asset_type === activeFilter);

  // Only show filter tabs that have assets
  const availableTypes = new Set(assets.map((a) => a.asset_type));
  const visibleFilters = typeFilters.filter(
    (f) => f.key === 'all' || availableTypes.has(f.key as AssetType)
  );

  return (
    <div>
      {/* Filter Tabs */}
      {visibleFilters.length > 2 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {visibleFilters.map((filter) => (
            <button
              key={filter.key}
              onClick={() => setActiveFilter(filter.key)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeFilter === filter.key
                  ? 'bg-primary-600 text-white'
                  : 'bg-secondary-100 text-secondary-600 hover:bg-secondary-200'
              }`}
            >
              {filter.label[lang]}
            </button>
          ))}
        </div>
      )}

      {/* Grid */}
      {filteredAssets.length === 0 ? (
        <p className="text-secondary-500 text-sm text-center py-8">
          {locale === 'es' ? 'No hay unidades disponibles.' : 'No units available.'}
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAssets.map((asset) => (
            <AssetCard key={asset.id} asset={asset} locale={locale} />
          ))}
        </div>
      )}
    </div>
  );
}
