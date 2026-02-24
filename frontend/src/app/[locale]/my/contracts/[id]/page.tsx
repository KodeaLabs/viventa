'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { PaymentTable } from '@/components/organisms/PaymentTable';
import { formatPrice, formatArea } from '../../../../../lib/api';
import { useAuthenticatedApi } from '@/hooks';
import type { BuyerContractDetail } from '@/types';

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

export default function ContractDetailPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'en';
  const id = params?.id as string;
  const lang = locale === 'es' ? 'es' : 'en';

  const [contract, setContract] = useState<BuyerContractDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { api, isAuthLoading, accessToken } = useAuthenticatedApi();

  useEffect(() => {
    if (isAuthLoading) return;

    if (!accessToken) {
      window.location.href = '/api/auth/login';
      return;
    }

    const fetchContract = async () => {
      try {
        const data = await api.getMyContract(id);
        setContract(data.data);
      } catch {
        setError(locale === 'es' ? 'Error al cargar el contrato' : 'Failed to load contract');
      } finally {
        setIsLoading(false);
      }
    };
    fetchContract();
  }, [id, locale, isAuthLoading, accessToken, api]);

  if (isAuthLoading || isLoading) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    );
  }

  if (error || !contract) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Contract not found'}</p>
          <Link href={`/${locale}/my/contracts`} className="text-primary-600 hover:underline">
            {locale === 'es' ? 'Volver a contratos' : 'Back to contracts'}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="container-custom py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-secondary-500 mb-6">
          <Link href={`/${locale}/my/contracts`} className="hover:text-primary-600">
            {locale === 'es' ? 'Mis Contratos' : 'My Contracts'}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-secondary-900">{contract.asset_identifier}</span>
        </nav>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contract Header */}
            <div className="bg-white rounded-xl p-6 shadow-card">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="font-display text-2xl font-bold text-secondary-900">
                    {contract.project_title}
                  </h1>
                  <p className="text-secondary-600">
                    {locale === 'es' ? 'Unidad' : 'Unit'}: {contract.asset_identifier}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[contract.status] || 'bg-secondary-100'}`}>
                  {statusLabels[contract.status]?.[lang] || contract.status}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-secondary-400">{locale === 'es' ? 'Precio Total' : 'Total Price'}</p>
                  <p className="font-semibold text-primary-600">{formatPrice(contract.total_price)}</p>
                </div>
                <div>
                  <p className="text-xs text-secondary-400">{locale === 'es' ? 'Inicial' : 'Initial Payment'}</p>
                  <p className="font-semibold">{formatPrice(contract.initial_payment)}</p>
                </div>
                <div>
                  <p className="text-xs text-secondary-400">{locale === 'es' ? 'Plan de Pago' : 'Payment Plan'}</p>
                  <p className="font-semibold">{contract.payment_plan_months} {locale === 'es' ? 'meses' : 'months'}</p>
                </div>
                <div>
                  <p className="text-xs text-secondary-400">{locale === 'es' ? 'Fecha Contrato' : 'Contract Date'}</p>
                  <p className="font-semibold">
                    {contract.contract_date
                      ? new Date(contract.contract_date).toLocaleDateString()
                      : '-'}
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Schedule */}
            <div className="bg-white rounded-xl p-6 shadow-card">
              <h2 className="font-display text-xl font-semibold text-secondary-900 mb-4">
                {locale === 'es' ? 'Cronograma de Pagos' : 'Payment Schedule'}
              </h2>
              <PaymentTable payments={contract.payments} locale={locale} />
            </div>
          </div>

          {/* Sidebar - Asset Info */}
          <div>
            <div className="bg-white rounded-xl p-6 shadow-card sticky top-24">
              <h3 className="font-display text-lg font-semibold text-secondary-900 mb-4">
                {locale === 'es' ? 'Detalles de la Unidad' : 'Unit Details'}
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-secondary-500">{locale === 'es' ? 'Tipo' : 'Type'}</span>
                  <span className="font-medium capitalize">{contract.asset?.asset_type?.replace('_', ' ')}</span>
                </div>
                {contract.asset?.floor !== null && (
                  <div className="flex justify-between">
                    <span className="text-secondary-500">{locale === 'es' ? 'Piso' : 'Floor'}</span>
                    <span className="font-medium">{contract.asset.floor}</span>
                  </div>
                )}
                {contract.asset?.area_sqm && (
                  <div className="flex justify-between">
                    <span className="text-secondary-500">{locale === 'es' ? 'Área' : 'Area'}</span>
                    <span className="font-medium">{formatArea(contract.asset.area_sqm)}</span>
                  </div>
                )}
                {contract.asset?.bedrooms > 0 && (
                  <div className="flex justify-between">
                    <span className="text-secondary-500">{locale === 'es' ? 'Habitaciones' : 'Bedrooms'}</span>
                    <span className="font-medium">{contract.asset.bedrooms}</span>
                  </div>
                )}
                {contract.asset?.bathrooms > 0 && (
                  <div className="flex justify-between">
                    <span className="text-secondary-500">{locale === 'es' ? 'Baños' : 'Bathrooms'}</span>
                    <span className="font-medium">{contract.asset.bathrooms}</span>
                  </div>
                )}
              </div>

              {contract.project_slug && (
                <Link
                  href={`/${locale}/projects/${contract.project_slug}`}
                  className="block mt-6 text-center px-4 py-2.5 border border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 transition-colors font-medium text-sm"
                >
                  {locale === 'es' ? 'Ver Proyecto' : 'View Project'}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
