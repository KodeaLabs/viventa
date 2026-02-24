'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { formatPrice } from '../../../../lib/api';
import { useAuthenticatedApi } from '@/hooks';
import type { ProjectListItem } from '@/types';

const statusColors: Record<string, string> = {
  draft: 'bg-secondary-100 text-secondary-700',
  presale: 'bg-blue-100 text-blue-800',
  under_construction: 'bg-amber-100 text-amber-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const statusLabels: Record<string, { en: string; es: string }> = {
  draft: { en: 'Draft', es: 'Borrador' },
  presale: { en: 'Pre-Sale', es: 'Pre-venta' },
  under_construction: { en: 'Construction', es: 'Construcción' },
  delivered: { en: 'Delivered', es: 'Entregado' },
  cancelled: { en: 'Cancelled', es: 'Cancelado' },
};

export default function AdminProjectsPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'en';
  const lang = locale === 'es' ? 'es' : 'en';

  const [projects, setProjects] = useState<ProjectListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { api, isAuthLoading, accessToken } = useAuthenticatedApi();

  useEffect(() => {
    if (isAuthLoading) return;

    if (!accessToken) {
      window.location.href = '/api/auth/login';
      return;
    }

    const fetchProjects = async () => {
      try {
        const data = await api.getAdminProjects();
        setProjects(data.data || []);
      } catch (err: any) {
        if (err?.message?.includes('403')) {
          setError(locale === 'es' ? 'No tienes permisos de administrador de proyectos.' : 'You don\'t have project admin permissions.');
        } else {
          setError(locale === 'es' ? 'Error al cargar proyectos' : 'Failed to load projects');
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, [locale, isAuthLoading, accessToken, api]);

  if (isAuthLoading || isLoading) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="container-custom py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-3xl font-bold text-secondary-900">
            {locale === 'es' ? 'Gestión de Proyectos' : 'Project Management'}
          </h1>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg mb-6">{error}</div>
        )}

        {projects.length === 0 && !error ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-card">
            <p className="text-secondary-500 text-lg">
              {locale === 'es'
                ? 'No tienes proyectos asignados.'
                : 'No projects assigned to you.'}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-secondary-200 bg-secondary-50">
                  <th className="text-left py-3 px-4 font-medium text-secondary-600">
                    {locale === 'es' ? 'Proyecto' : 'Project'}
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-secondary-600">
                    {locale === 'es' ? 'Ubicación' : 'Location'}
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-secondary-600">
                    {locale === 'es' ? 'Estado' : 'Status'}
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-secondary-600">
                    {locale === 'es' ? 'Unidades' : 'Units'}
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-secondary-600">
                    {locale === 'es' ? 'Precio desde' : 'Price from'}
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-secondary-600">
                    {locale === 'es' ? 'Acciones' : 'Actions'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr key={project.id} className="border-b border-secondary-100 hover:bg-secondary-50">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-secondary-900">{project.title}</p>
                        <p className="text-xs text-secondary-500">{project.developer_name}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-secondary-600">
                      {project.location_display}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[project.status] || 'bg-secondary-100'}`}>
                        {statusLabels[project.status]?.[lang] || project.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="text-green-600">{project.available_units}</span>
                      <span className="text-secondary-400">/{project.total_units}</span>
                    </td>
                    <td className="py-3 px-4 text-right font-medium">
                      {project.price_range_min ? formatPrice(project.price_range_min) : '-'}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Link
                        href={`/${locale}/admin/projects/${project.id}`}
                        className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                      >
                        {locale === 'es' ? 'Gestionar' : 'Manage'}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
