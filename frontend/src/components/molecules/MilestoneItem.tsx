import { cn } from '../../lib/utils';
import type { ProjectMilestone } from '@/types';

interface MilestoneItemProps {
  milestone: ProjectMilestone;
  locale: string;
  isLast?: boolean;
}

const statusDotColors: Record<string, string> = {
  pending: 'bg-secondary-300',
  in_progress: 'bg-amber-400 animate-pulse',
  completed: 'bg-green-500',
  delayed: 'bg-red-400',
};

const statusLabels: Record<string, { en: string; es: string }> = {
  pending: { en: 'Pending', es: 'Pendiente' },
  in_progress: { en: 'In Progress', es: 'En Progreso' },
  completed: { en: 'Completed', es: 'Completado' },
  delayed: { en: 'Delayed', es: 'Retrasado' },
};

export function MilestoneItem({ milestone, locale, isLast = false }: MilestoneItemProps) {
  const lang = locale === 'es' ? 'es' : 'en';
  const title = locale === 'es' && milestone.title_es ? milestone.title_es : milestone.title;
  const description = locale === 'es' && milestone.description_es ? milestone.description_es : milestone.description;

  return (
    <div className="relative flex gap-4">
      {/* Timeline line */}
      {!isLast && (
        <div className="absolute left-[11px] top-6 w-0.5 h-full bg-secondary-200" />
      )}

      {/* Dot */}
      <div className="relative z-10 flex-shrink-0 mt-1">
        <div className={cn(
          'w-6 h-6 rounded-full border-2 border-white shadow-sm',
          statusDotColors[milestone.status] || 'bg-secondary-300'
        )} />
      </div>

      {/* Content */}
      <div className="pb-6 flex-1">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-medium text-secondary-900">{title}</h4>
          <span className="text-xs text-secondary-400">
            {statusLabels[milestone.status]?.[lang] || milestone.status}
          </span>
        </div>
        {description && (
          <p className="text-sm text-secondary-600 mb-1">{description}</p>
        )}
        <div className="flex items-center gap-4 text-xs text-secondary-400">
          {milestone.target_date && (
            <span>
              {locale === 'es' ? 'Meta' : 'Target'}: {new Date(milestone.target_date).toLocaleDateString(locale === 'es' ? 'es-VE' : 'en-US', { month: 'short', year: 'numeric' })}
            </span>
          )}
          {milestone.completed_date && (
            <span className="text-green-600">
              {locale === 'es' ? 'Completado' : 'Completed'}: {new Date(milestone.completed_date).toLocaleDateString(locale === 'es' ? 'es-VE' : 'en-US', { month: 'short', year: 'numeric' })}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
