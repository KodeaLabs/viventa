'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { formatPrice } from '../../../../lib/api';
import type { BuyerContractListItem } from '@/types';

const statusColors: Record<string, string> = {
  reserved: 'bg-amber-100 text-amber-800',
  signed: 'bg-blue-100 text-blue-800',
  active: 'bg-green-100 text-green-800',
  completed: 'bg-secondary-100 text-secondary-800',
  cancelled: 'bg-red-100 text-red-800',
};

const statusLabels: Record<string, { en: string; es: string }> = {
  reserved: { en: 'Reserved', es: 'Reservado' },
  signed: { en: 'Signed', es: 'Firmado' },
  active: { en: 'Active', es: 'Activo' },
  completed: { en: 'Completed', es: 'Completado' },
  cancelled: { en: 'Cancelled', es: 'Cancelado' },
};

export default function BuyerContractsPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'en';
  const lang = locale === 'es' ? 'es' : 'en';

  const [contracts, setContracts] = useState<BuyerContractListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const response = await fetch('/api/v1/my/contracts/', {
          credentials: 'include',
        });
        if (response.status === 401) {
          window.location.href = '/api/auth/login';
          return;
        }
        const data = await response.json();
        setContracts(data.data || []);
      } catch (err) {
        setError(locale === 'es' ? 'Error al cargar contratos' : 'Failed to load contracts');
      } finally {
        setIsLoading(false);
      }
    };
    fetchContracts();
  }, [locale]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="container-custom py-8">
        <h1 className="font-display text-3xl font-bold text-secondary-900 mb-6">
          {locale === 'es' ? 'Mis Contratos' : 'My Contracts'}
        </h1>

        {error && (
          <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg mb-6">{error}</div>
        )}

        {contracts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-card">
            <p className="text-secondary-500 text-lg">
              {locale === 'es'
                ? 'No tienes contratos activos.'
                : 'You don\'t have any contracts yet.'}
            </p>
            <Link
              href={`/${locale}/projects`}
              className="inline-block mt-4 px-6 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              {locale === 'es' ? 'Ver Proyectos' : 'Browse Projects'}
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {contracts.map((contract) => (
              <Link
                key={contract.id}
                href={`/${locale}/my/contracts/${contract.id}`}
                className="block bg-white rounded-xl p-6 shadow-card hover:shadow-card-hover transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-secondary-900">
                      {contract.project_title}
                    </h3>
                    <p className="text-secondary-500 text-sm">
                      {locale === 'es' ? 'Unidad' : 'Unit'}: {contract.asset_identifier}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[contract.status] || 'bg-secondary-100'}`}>
                    {statusLabels[contract.status]?.[lang] || contract.status}
                  </span>
                </div>
                <div className="mt-3 flex items-center gap-6 text-sm text-secondary-600">
                  <div>
                    <span className="text-secondary-400">{locale === 'es' ? 'Precio total' : 'Total price'}:</span>{' '}
                    <span className="font-medium">{formatPrice(contract.total_price)}</span>
                  </div>
                  {contract.contract_date && (
                    <div>
                      <span className="text-secondary-400">{locale === 'es' ? 'Fecha' : 'Date'}:</span>{' '}
                      <span>{new Date(contract.contract_date).toLocaleDateString()}</span>
                    </div>
                  )}
                  {contract.payment_plan_months > 0 && (
                    <div>
                      <span className="text-secondary-400">{locale === 'es' ? 'Plan' : 'Plan'}:</span>{' '}
                      <span>{contract.payment_plan_months} {locale === 'es' ? 'meses' : 'months'}</span>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
