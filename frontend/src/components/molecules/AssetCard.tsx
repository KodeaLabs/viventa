import { cn } from '../../lib/utils';
import { formatPrice, formatArea } from '../../lib/api';
import type { SellableAsset } from '@/types';

interface AssetCardProps {
  asset: SellableAsset;
  locale: string;
}

const assetTypeIcons: Record<string, string> = {
  apartment: 'M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 7.5h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z',
  parking: 'M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.125-.504 1.125-1.125v-3.75M5.25 5.25h8.25a2.25 2.25 0 012.25 2.25v7.5',
  storage: 'M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z',
  commercial: 'M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.15c0 .415.336.75.75.75z',
  land_lot: 'M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z',
};

const assetTypeLabels: Record<string, { en: string; es: string }> = {
  apartment: { en: 'Apartment', es: 'Apartamento' },
  parking: { en: 'Parking', es: 'Estacionamiento' },
  storage: { en: 'Storage', es: 'Maletero' },
  commercial: { en: 'Commercial', es: 'Comercial' },
  land_lot: { en: 'Land Lot', es: 'Lote' },
};

const statusColors: Record<string, string> = {
  available: 'bg-green-100 text-green-800',
  reserved: 'bg-amber-100 text-amber-800',
  sold: 'bg-red-100 text-red-800',
  delivered: 'bg-blue-100 text-blue-800',
};

const statusLabels: Record<string, { en: string; es: string }> = {
  available: { en: 'Available', es: 'Disponible' },
  reserved: { en: 'Reserved', es: 'Reservado' },
  sold: { en: 'Sold', es: 'Vendido' },
  delivered: { en: 'Delivered', es: 'Entregado' },
};

export function AssetCard({ asset, locale }: AssetCardProps) {
  const lang = locale === 'es' ? 'es' : 'en';

  return (
    <div className="bg-white rounded-lg border border-secondary-100 p-4 hover:shadow-card transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center">
            <svg className="w-4 h-4 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={assetTypeIcons[asset.asset_type] || assetTypeIcons.apartment} />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-secondary-900">{asset.identifier}</p>
            <p className="text-xs text-secondary-500">{assetTypeLabels[asset.asset_type]?.[lang] || asset.asset_type}</p>
          </div>
        </div>
        <span className={cn(
          'px-2 py-0.5 rounded-full text-xs font-medium',
          statusColors[asset.status] || 'bg-secondary-100 text-secondary-800'
        )}>
          {statusLabels[asset.status]?.[lang] || asset.status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm text-secondary-600 mb-3">
        {asset.floor !== null && (
          <div>
            <span className="text-secondary-400">{locale === 'es' ? 'Piso' : 'Floor'}:</span>{' '}
            <span className="font-medium">{asset.floor}</span>
          </div>
        )}
        {asset.area_sqm && (
          <div>
            <span className="text-secondary-400">{locale === 'es' ? 'Área' : 'Area'}:</span>{' '}
            <span className="font-medium">{formatArea(asset.area_sqm)}</span>
          </div>
        )}
        {asset.bedrooms > 0 && (
          <div>
            <span className="text-secondary-400">{locale === 'es' ? 'Hab.' : 'Beds'}:</span>{' '}
            <span className="font-medium">{asset.bedrooms}</span>
          </div>
        )}
        {asset.bathrooms > 0 && (
          <div>
            <span className="text-secondary-400">{locale === 'es' ? 'Baños' : 'Baths'}:</span>{' '}
            <span className="font-medium">{asset.bathrooms}</span>
          </div>
        )}
      </div>

      <p className="text-primary-600 font-bold text-lg">
        {formatPrice(asset.price_usd)}
      </p>
    </div>
  );
}
