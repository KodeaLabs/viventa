import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { AssetGrid } from '@/components/organisms/AssetGrid';
import { MilestoneTimeline } from '@/components/organisms/MilestoneTimeline';
import { api, formatPrice } from '../../../../lib/api';
import type { ProjectDetail, SellableAsset, ProjectUpdateItem } from '@/types';

interface ProjectDetailPageProps {
  params: { locale: string; slug: string };
}

export default async function ProjectDetailPage({
  params: { locale, slug },
}: ProjectDetailPageProps) {
  const t = await getTranslations({ locale, namespace: 'project' });

  // Fetch project detail
  let project: ProjectDetail | null = null;
  try {
    const response = await api.getProject(slug);
    project = response.data;
  } catch (error) {
    notFound();
  }

  if (!project) {
    notFound();
  }

  // Fetch available assets
  let assets: SellableAsset[] = [];
  try {
    const assetsResponse = await api.getProjectAssets(slug);
    assets = assetsResponse.data || [];
  } catch (error) {
    console.error('Failed to fetch assets:', error);
  }

  // Fetch public updates
  let updates: ProjectUpdateItem[] = [];
  try {
    const updatesResponse = await api.getProjectUpdates(slug);
    updates = updatesResponse.data || [];
  } catch (error) {
    console.error('Failed to fetch updates:', error);
  }

  const title = locale === 'es' && project.title_es ? project.title_es : project.title;
  const description = locale === 'es' && project.description_es ? project.description_es : project.description;

  const statusLabel = {
    presale: locale === 'es' ? 'Pre-venta' : 'Pre-Sale',
    under_construction: locale === 'es' ? 'En Construcción' : 'Under Construction',
    delivered: locale === 'es' ? 'Entregado' : 'Delivered',
    cancelled: locale === 'es' ? 'Cancelado' : 'Cancelled',
    draft: locale === 'es' ? 'Borrador' : 'Draft',
  };

  const statusColors: Record<string, string> = {
    presale: 'bg-blue-100 text-blue-800',
    under_construction: 'bg-amber-100 text-amber-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  // Gallery images: combine cover + gallery
  const allImages = [
    ...(project.cover_image_url ? [{ url: project.cover_image_url, caption: title }] : []),
    ...project.gallery_images.map((img) => ({
      url: img.image || img.image_url,
      caption: img.caption,
    })),
  ];

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Hero / Gallery */}
      <div className="bg-white">
        <div className="container-custom py-6">
          {/* Breadcrumb */}
          <nav className="text-sm text-secondary-500 mb-4">
            <Link href={`/${locale}/projects`} className="hover:text-primary-600">
              {locale === 'es' ? 'Proyectos' : 'Projects'}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-secondary-900">{title}</span>
          </nav>

          {/* Gallery */}
          {allImages.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 rounded-xl overflow-hidden mb-6">
              <div className="md:col-span-2 h-64 md:h-96">
                <img
                  src={allImages[0].url}
                  alt={allImages[0].caption}
                  className="w-full h-full object-cover"
                />
              </div>
              {allImages.length > 1 && (
                <div className="hidden md:grid grid-rows-2 gap-3">
                  {allImages.slice(1, 3).map((img, i) => (
                    <div key={i} className="overflow-hidden">
                      <img
                        src={img.url}
                        alt={img.caption}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="container-custom py-8 md:py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title & Status */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="font-display text-3xl md:text-4xl font-bold text-secondary-900">
                  {title}
                </h1>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[project.status] || 'bg-secondary-100'}`}>
                  {statusLabel[project.status as keyof typeof statusLabel] || project.status}
                </span>
              </div>
              <p className="text-secondary-600 text-lg">
                {project.developer_name} &middot; {project.location_display}
              </p>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl p-6 shadow-card">
              <h2 className="font-display text-xl font-semibold text-secondary-900 mb-3">
                {locale === 'es' ? 'Descripción' : 'Description'}
              </h2>
              <p className="text-secondary-700 whitespace-pre-line">{description}</p>
            </div>

            {/* Amenities */}
            {project.amenities && project.amenities.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-card">
                <h2 className="font-display text-xl font-semibold text-secondary-900 mb-3">
                  {t('amenities')}
                </h2>
                <div className="flex flex-wrap gap-2">
                  {project.amenities.map((amenity, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 bg-primary-50 text-primary-700 rounded-lg text-sm"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Available Units */}
            <div className="bg-white rounded-xl p-6 shadow-card">
              <h2 className="font-display text-xl font-semibold text-secondary-900 mb-4">
                {t('assets')} ({assets.length})
              </h2>
              <AssetGrid assets={assets} locale={locale} />
            </div>

            {/* Milestones */}
            {project.milestones && project.milestones.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-card">
                <h2 className="font-display text-xl font-semibold text-secondary-900 mb-4">
                  {t('milestones')}
                </h2>
                <MilestoneTimeline milestones={project.milestones} locale={locale} />
              </div>
            )}

            {/* Updates */}
            {updates.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-card">
                <h2 className="font-display text-xl font-semibold text-secondary-900 mb-4">
                  {t('updates')}
                </h2>
                <div className="space-y-4">
                  {updates.map((update) => (
                    <div key={update.id} className="border-b border-secondary-100 pb-4 last:border-0">
                      <h3 className="font-medium text-secondary-900">
                        {locale === 'es' && update.title_es ? update.title_es : update.title}
                      </h3>
                      {update.content && (
                        <p className="text-secondary-600 text-sm mt-1 line-clamp-3">
                          {locale === 'es' && update.content_es ? update.content_es : update.content}
                        </p>
                      )}
                      <p className="text-xs text-secondary-400 mt-1">
                        {update.published_at
                          ? new Date(update.published_at).toLocaleDateString(locale === 'es' ? 'es-VE' : 'en-US')
                          : ''}
                        {update.author_name && ` - ${update.author_name}`}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Key Info Card */}
            <div className="bg-white rounded-xl p-6 shadow-card sticky top-24">
              <h3 className="font-display text-lg font-semibold text-secondary-900 mb-4">
                {locale === 'es' ? 'Información del Proyecto' : 'Project Information'}
              </h3>

              <div className="space-y-3">
                {/* Price Range */}
                {project.price_range_min && (
                  <div className="flex justify-between">
                    <span className="text-secondary-500">{locale === 'es' ? 'Precio desde' : 'Price from'}</span>
                    <span className="font-semibold text-primary-600">{formatPrice(project.price_range_min)}</span>
                  </div>
                )}
                {project.price_range_max && (
                  <div className="flex justify-between">
                    <span className="text-secondary-500">{locale === 'es' ? 'Precio hasta' : 'Price up to'}</span>
                    <span className="font-semibold text-primary-600">{formatPrice(project.price_range_max)}</span>
                  </div>
                )}

                <hr className="border-secondary-100" />

                {/* Units */}
                <div className="flex justify-between">
                  <span className="text-secondary-500">{locale === 'es' ? 'Unidades totales' : 'Total units'}</span>
                  <span className="font-medium">{project.total_units}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary-500">{locale === 'es' ? 'Disponibles' : 'Available'}</span>
                  <span className="font-medium text-green-600">{project.available_units}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary-500">{locale === 'es' ? 'Vendidas' : 'Sold'}</span>
                  <span className="font-medium">{project.sold_units}</span>
                </div>

                <hr className="border-secondary-100" />

                {/* Progress */}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-secondary-500">{locale === 'es' ? 'Progreso' : 'Progress'}</span>
                    <span className="font-medium">{project.progress_percentage}%</span>
                  </div>
                  <div className="w-full bg-secondary-100 rounded-full h-2.5">
                    <div
                      className="bg-primary-500 h-2.5 rounded-full"
                      style={{ width: `${project.progress_percentage}%` }}
                    />
                  </div>
                </div>

                {/* Dates */}
                {project.delivery_date && (
                  <div className="flex justify-between">
                    <span className="text-secondary-500">{locale === 'es' ? 'Entrega estimada' : 'Est. delivery'}</span>
                    <span className="font-medium">
                      {new Date(project.delivery_date).toLocaleDateString(locale === 'es' ? 'es-VE' : 'en-US', { year: 'numeric', month: 'short' })}
                    </span>
                  </div>
                )}

                {/* Developer */}
                <hr className="border-secondary-100" />
                <div>
                  <span className="text-secondary-500 text-sm">{locale === 'es' ? 'Desarrollador' : 'Developer'}</span>
                  <p className="font-medium text-secondary-900">{project.developer_name}</p>
                </div>
              </div>

              {/* Links */}
              <div className="mt-6 space-y-2">
                {project.brochure_url && (
                  <a
                    href={project.brochure_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center px-4 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
                  >
                    {t('brochure')}
                  </a>
                )}
                {project.master_plan_url && (
                  <a
                    href={project.master_plan_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center px-4 py-2.5 border border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 transition-colors font-medium"
                  >
                    {t('masterPlan')}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
