import { getTranslations } from 'next-intl/server';
import { ProjectGrid } from '@/components/organisms';
import { api } from '../../../lib/api';
import type { ProjectListItem, ProjectFilters } from '@/types';

interface ProjectsPageProps {
  params: { locale: string };
  searchParams: {
    search?: string;
    status?: string;
    city?: string;
    state?: string;
    min_price?: string;
    max_price?: string;
    is_featured?: string;
    page?: string;
  };
}

export default async function ProjectsPage({
  params: { locale },
  searchParams,
}: ProjectsPageProps) {
  const t = await getTranslations({ locale, namespace: 'project' });

  // Build filters from search params
  const filters: Record<string, any> = {};
  if (searchParams.search) filters.search = searchParams.search;
  if (searchParams.status) filters.status = searchParams.status;
  if (searchParams.city) filters.city = searchParams.city;
  if (searchParams.state) filters.state = searchParams.state;
  if (searchParams.min_price) filters.min_price = searchParams.min_price;
  if (searchParams.max_price) filters.max_price = searchParams.max_price;
  if (searchParams.is_featured) filters.is_featured = searchParams.is_featured;
  if (searchParams.page) filters.page = searchParams.page;

  // Fetch projects
  let projects: ProjectListItem[] = [];
  let meta = null;
  try {
    const response = await api.getProjects(filters as ProjectFilters);
    projects = response.data || [];
    meta = response.meta;
  } catch (error) {
    console.error('Failed to fetch projects:', error);
  }

  const projectTranslations = {
    units: t('units'),
    available: t('available'),
    priceFrom: t('priceFrom'),
    deliveryDate: t('deliveryDate'),
    progress: t('progress'),
    viewDetails: t('viewDetails'),
    presale: t('status.presale'),
    underConstruction: t('status.under_construction'),
    delivered: t('status.delivered'),
    featured: t('featured'),
    noProjects: t('noProjects'),
  };

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Header */}
      <div className="bg-white border-b border-secondary-100">
        <div className="container-custom py-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-secondary-900 mb-2">
            {t('title')}
          </h1>
          <p className="text-secondary-600 text-lg">
            {t('subtitle')}
          </p>
        </div>
      </div>

      {/* Results */}
      <div className="container-custom py-8 md:py-12">
        {/* Results count */}
        {meta && (
          <p className="text-secondary-600 mb-6">
            {locale === 'en'
              ? `Showing ${projects.length} of ${meta.total_count} projects`
              : `Mostrando ${projects.length} de ${meta.total_count} proyectos`}
          </p>
        )}

        <ProjectGrid
          projects={projects}
          locale={locale}
          translations={projectTranslations}
        />

        {/* Pagination */}
        {meta && meta.total_pages > 1 && (
          <div className="mt-12 flex justify-center gap-2">
            {Array.from({ length: meta.total_pages }, (_, i) => i + 1).map((page) => (
              <a
                key={page}
                href={`/${locale}/projects?${new URLSearchParams({
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
