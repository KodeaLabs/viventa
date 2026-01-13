'use client';

import {
  ShieldCheckIcon,
  CheckBadgeIcon,
  LockClosedIcon,
  GlobeAltIcon,
} from '@heroicons/react/24/solid';
import { cn } from '@/lib/utils';

interface TrustBadgesProps {
  locale: 'en' | 'es';
  variant?: 'inline' | 'grid';
  className?: string;
}

export function TrustBadges({ locale, variant = 'inline', className }: TrustBadgesProps) {
  const badges = [
    {
      icon: CheckBadgeIcon,
      label: locale === 'es' ? 'Agentes Verificados' : 'Verified Agents',
      color: 'text-accent-600',
    },
    {
      icon: ShieldCheckIcon,
      label: locale === 'es' ? 'Transacciones Seguras' : 'Secure Transactions',
      color: 'text-green-600',
    },
    {
      icon: LockClosedIcon,
      label: locale === 'es' ? 'Datos Protegidos' : 'Data Protected',
      color: 'text-primary-600',
    },
    {
      icon: GlobeAltIcon,
      label: locale === 'es' ? 'Soporte Bilingüe' : 'Bilingual Support',
      color: 'text-blue-600',
    },
  ];

  if (variant === 'grid') {
    return (
      <div className={cn('grid grid-cols-2 md:grid-cols-4 gap-4', className)}>
        {badges.map((badge) => (
          <div
            key={badge.label}
            className="flex flex-col items-center text-center p-4 bg-white rounded-lg shadow-card"
          >
            <badge.icon className={cn('h-8 w-8 mb-2', badge.color)} />
            <span className="text-sm font-medium text-secondary-700">{badge.label}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn('flex flex-wrap items-center gap-6', className)}>
      {badges.map((badge) => (
        <div key={badge.label} className="flex items-center gap-2">
          <badge.icon className={cn('h-5 w-5', badge.color)} />
          <span className="text-sm text-secondary-600">{badge.label}</span>
        </div>
      ))}
    </div>
  );
}
