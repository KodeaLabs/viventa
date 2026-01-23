import Link from 'next/link';
import { cn } from '../../lib/utils';
import { formatPrice } from '../../lib/api';
import type { ProjectListItem } from '@/types';

interface ProjectCardProps {
  project: ProjectListItem;
  locale: string;
  translations: {
    units: string;
    available: string;
    priceFrom: string;
    deliveryDate: string;
    progress: string;
    viewDetails: string;
    presale: string;
    underConstruction: string;
    delivered: string;
  };
}

const statusColors: Record<string, string> = {
  presale: 'bg-blue-100 text-blue-800',
  under_construction: 'bg-amber-100 text-amber-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const statusLabels = (status: string, translations: ProjectCardProps['translations']) => {
  switch (status) {
    case 'presale': return translations.presale;
    case 'under_construction': return translations.underConstruction;
    case 'delivered': return translations.delivered;
    default: return status;
  }
};

export function ProjectCard({ project, locale, translations }: ProjectCardProps) {
  const title = locale === 'es' && project.title_es ? project.title_es : project.title;

  return (
    <Link
      href={`/${locale}/projects/${project.slug}`}
      className="group block bg-white rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300"
    >
      {/* Cover Image */}
      <div className="relative h-48 bg-secondary-100 overflow-hidden">
        {project.cover_image_url ? (
          <img
            src={project.cover_image_url}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-secondary-400">
            <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 7.5h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
            </svg>
          </div>
        )}
        {/* Status Badge */}
        <span className={cn(
          'absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-medium',
          statusColors[project.status] || 'bg-secondary-100 text-secondary-800'
        )}>
          {statusLabels(project.status, translations)}
        </span>
        {project.is_featured && (
          <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-medium bg-primary-600 text-white">
            Featured
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-display text-lg font-semibold text-secondary-900 mb-1 group-hover:text-primary-600 transition-colors">
          {title}
        </h3>
        <p className="text-sm text-secondary-500 mb-3">
          {project.developer_name} &middot; {project.location_display}
        </p>

        {/* Price Range */}
        {project.price_range_min && (
          <p className="text-primary-600 font-semibold mb-3">
            {translations.priceFrom} {formatPrice(project.price_range_min)}
            {project.price_range_max && ` - ${formatPrice(project.price_range_max)}`}
          </p>
        )}

        {/* Progress Bar */}
        <div className="mb-3">
          <div className="flex justify-between text-xs text-secondary-500 mb-1">
            <span>{translations.progress}</span>
            <span>{project.progress_percentage}%</span>
          </div>
          <div className="w-full bg-secondary-100 rounded-full h-2">
            <div
              className="bg-primary-500 h-2 rounded-full transition-all"
              style={{ width: `${project.progress_percentage}%` }}
            />
          </div>
        </div>

        {/* Units Info */}
        <div className="flex items-center justify-between text-sm text-secondary-600">
          <span>{project.available_units} {translations.available}</span>
          <span>{project.total_units} {translations.units}</span>
        </div>

        {/* Delivery Date */}
        {project.delivery_date && (
          <p className="text-xs text-secondary-400 mt-2">
            {translations.deliveryDate}: {new Date(project.delivery_date).toLocaleDateString(locale === 'es' ? 'es-VE' : 'en-US', { year: 'numeric', month: 'short' })}
          </p>
        )}
      </div>
    </Link>
  );
}
