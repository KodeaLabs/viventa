'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { AssetGrid } from '@/components/organisms/AssetGrid';
import { MilestoneTimeline } from '@/components/organisms/MilestoneTimeline';
import { formatPrice } from '../../../../../lib/api';
import type { ProjectDetail, SellableAsset, BuyerContractListItem } from '@/types';

const statusColors: Record<string, string> = {
  draft: 'bg-secondary-100 text-secondary-700',
  presale: 'bg-blue-100 text-blue-800',
  under_construction: 'bg-amber-100 text-amber-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

type TabType = 'overview' | 'assets' | 'contracts';

export default function AdminProjectDetailPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'en';
  const id = params?.id as string;

  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [assets, setAssets] = useState<SellableAsset[]>([]);
  const [contracts, setContracts] = useState<BuyerContractListItem[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [transitionLoading, setTransitionLoading] = useState(false);

  const fetchData = async () => {
    try {
      // Fetch project detail
      const projectRes = await fetch(`/api/v1/admin/projects/${id}/`, {
        credentials: 'include',
      });
      if (projectRes.status === 401) {
        window.location.href = '/api/auth/login';
        return;
      }
      if (!projectRes.ok) throw new Error('Failed to load project');
      const projectData = await projectRes.json();
      setProject(projectData.data || projectData);

      // Fetch assets
      const assetsRes = await fetch(`/api/v1/admin/projects/${id}/assets/`, {
        credentials: 'include',
      });
      if (assetsRes.ok) {
        const assetsData = await assetsRes.json();
        setAssets(assetsData.data || []);
      }

      // Fetch contracts
      const contractsRes = await fetch(`/api/v1/admin/projects/${id}/contracts/`, {
        credentials: 'include',
      });
      if (contractsRes.ok) {
        const contractsData = await contractsRes.json();
        setContracts(contractsData.data || []);
      }
    } catch (err) {
      setError(locale === 'es' ? 'Error al cargar el proyecto' : 'Failed to load project');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleTransition = async (action: string) => {
    setTransitionLoading(true);
    try {
      const response = await fetch(`/api/v1/admin/projects/${id}/${action}/`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.ok) {
        await fetchData();
      } else {
        const data = await response.json();
        alert(data.error?.message || 'Transition failed');
      }
    } catch (err) {
      alert('Failed to perform transition');
    } finally {
      setTransitionLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Project not found'}</p>
          <Link href={`/${locale}/admin/projects`} className="text-primary-600 hover:underline">
            {locale === 'es' ? 'Volver' : 'Go back'}
          </Link>
        </div>
      </div>
    );
  }

  // Available transitions based on current status
  const availableTransitions: Record<string, { action: string; label: { en: string; es: string } }[]> = {
    draft: [{ action: 'start_presale', label: { en: 'Start Pre-Sale', es: 'Iniciar Pre-Venta' } }],
    presale: [
      { action: 'start_construction', label: { en: 'Start Construction', es: 'Iniciar Construcción' } },
      { action: 'mark_delivered', label: { en: 'Mark Delivered', es: 'Marcar Entregado' } },
    ],
    under_construction: [
      { action: 'mark_delivered', label: { en: 'Mark Delivered', es: 'Marcar Entregado' } },
    ],
  };

  const transitions = availableTransitions[project.status] || [];

  const tabs: { key: TabType; label: { en: string; es: string } }[] = [
    { key: 'overview', label: { en: 'Overview', es: 'General' } },
    { key: 'assets', label: { en: `Assets (${assets.length})`, es: `Unidades (${assets.length})` } },
    { key: 'contracts', label: { en: `Contracts (${contracts.length})`, es: `Contratos (${contracts.length})` } },
  ];

  const lang = locale === 'es' ? 'es' : 'en';

  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="container-custom py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-secondary-500 mb-4">
          <Link href={`/${locale}/admin/projects`} className="hover:text-primary-600">
            {locale === 'es' ? 'Proyectos' : 'Projects'}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-secondary-900">{project.title}</span>
        </nav>

        {/* Header */}
        <div className="bg-white rounded-xl p-6 shadow-card mb-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="font-display text-2xl font-bold text-secondary-900">
                  {project.title}
                </h1>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[project.status] || 'bg-secondary-100'}`}>
                  {project.status.replace('_', ' ')}
                </span>
              </div>
              <p className="text-secondary-500 mt-1">
                {project.developer_name} &middot; {project.location_display}
              </p>
            </div>
            <div className="flex gap-2">
              {transitions.map((t) => (
                <button
                  key={t.action}
                  onClick={() => handleTransition(t.action)}
                  disabled={transitionLoading}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium disabled:opacity-50"
                >
                  {t.label[lang]}
                </button>
              ))}
              {project.status !== 'delivered' && project.status !== 'cancelled' && (
                <button
                  onClick={() => {
                    if (confirm(locale === 'es' ? '¿Cancelar este proyecto?' : 'Cancel this project?')) {
                      handleTransition('cancel_project');
                    }
                  }}
                  disabled={transitionLoading}
                  className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium disabled:opacity-50"
                >
                  {locale === 'es' ? 'Cancelar' : 'Cancel'}
                </button>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
            <div className="bg-secondary-50 rounded-lg p-3">
              <p className="text-xs text-secondary-500">{locale === 'es' ? 'Total Unidades' : 'Total Units'}</p>
              <p className="text-xl font-bold text-secondary-900">{project.total_units}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-3">
              <p className="text-xs text-green-600">{locale === 'es' ? 'Disponibles' : 'Available'}</p>
              <p className="text-xl font-bold text-green-700">{project.available_units}</p>
            </div>
            <div className="bg-amber-50 rounded-lg p-3">
              <p className="text-xs text-amber-600">{locale === 'es' ? 'Vendidas' : 'Sold'}</p>
              <p className="text-xl font-bold text-amber-700">{project.sold_units}</p>
            </div>
            <div className="bg-primary-50 rounded-lg p-3">
              <p className="text-xs text-primary-600">{locale === 'es' ? 'Progreso' : 'Progress'}</p>
              <p className="text-xl font-bold text-primary-700">{project.progress_percentage}%</p>
            </div>
            <div className="bg-secondary-50 rounded-lg p-3">
              <p className="text-xs text-secondary-500">{locale === 'es' ? 'Contratos' : 'Contracts'}</p>
              <p className="text-xl font-bold text-secondary-900">{contracts.length}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-white rounded-lg p-1 shadow-card w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? 'bg-primary-600 text-white'
                  : 'text-secondary-600 hover:bg-secondary-100'
              }`}
            >
              {tab.label[lang]}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-card">
              <h3 className="font-display text-lg font-semibold text-secondary-900 mb-3">
                {locale === 'es' ? 'Información' : 'Information'}
              </h3>
              <div className="space-y-2 text-sm">
                {project.price_range_min && (
                  <div className="flex justify-between">
                    <span className="text-secondary-500">{locale === 'es' ? 'Rango de precios' : 'Price range'}</span>
                    <span className="font-medium">
                      {formatPrice(project.price_range_min)} - {project.price_range_max ? formatPrice(project.price_range_max) : ''}
                    </span>
                  </div>
                )}
                {project.delivery_date && (
                  <div className="flex justify-between">
                    <span className="text-secondary-500">{locale === 'es' ? 'Entrega' : 'Delivery'}</span>
                    <span className="font-medium">{new Date(project.delivery_date).toLocaleDateString()}</span>
                  </div>
                )}
                {project.construction_start_date && (
                  <div className="flex justify-between">
                    <span className="text-secondary-500">{locale === 'es' ? 'Inicio construcción' : 'Construction start'}</span>
                    <span className="font-medium">{new Date(project.construction_start_date).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-card">
              <h3 className="font-display text-lg font-semibold text-secondary-900 mb-3">
                {locale === 'es' ? 'Progreso de Construcción' : 'Construction Progress'}
              </h3>
              <MilestoneTimeline milestones={project.milestones || []} locale={locale} />
            </div>
          </div>
        )}

        {activeTab === 'assets' && (
          <div className="bg-white rounded-xl p-6 shadow-card">
            <AssetGrid assets={assets} locale={locale} />
          </div>
        )}

        {activeTab === 'contracts' && (
          <div className="bg-white rounded-xl shadow-card overflow-hidden">
            {contracts.length === 0 ? (
              <div className="p-6 text-center text-secondary-500">
                {locale === 'es' ? 'No hay contratos.' : 'No contracts.'}
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-secondary-200 bg-secondary-50">
                    <th className="text-left py-3 px-4 font-medium text-secondary-600">
                      {locale === 'es' ? 'Comprador' : 'Buyer'}
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-secondary-600">
                      {locale === 'es' ? 'Unidad' : 'Unit'}
                    </th>
                    <th className="text-right py-3 px-4 font-medium text-secondary-600">
                      {locale === 'es' ? 'Precio' : 'Price'}
                    </th>
                    <th className="text-center py-3 px-4 font-medium text-secondary-600">
                      {locale === 'es' ? 'Estado' : 'Status'}
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-secondary-600">
                      {locale === 'es' ? 'Fecha' : 'Date'}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {contracts.map((contract) => (
                    <tr key={contract.id} className="border-b border-secondary-100 hover:bg-secondary-50">
                      <td className="py-3 px-4">
                        <p className="font-medium text-secondary-900">{contract.buyer_name}</p>
                        <p className="text-xs text-secondary-500">{contract.buyer_email}</p>
                      </td>
                      <td className="py-3 px-4 text-secondary-600">{contract.asset_identifier}</td>
                      <td className="py-3 px-4 text-right font-medium">{formatPrice(contract.total_price)}</td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[contract.status] || 'bg-secondary-100'}`}>
                          {contract.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-secondary-600">
                        {contract.contract_date ? new Date(contract.contract_date).toLocaleDateString() : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
