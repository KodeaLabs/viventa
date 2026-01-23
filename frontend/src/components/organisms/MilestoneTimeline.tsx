import { MilestoneItem } from '../molecules/MilestoneItem';
import type { ProjectMilestone } from '@/types';

interface MilestoneTimelineProps {
  milestones: ProjectMilestone[];
  locale: string;
}

export function MilestoneTimeline({ milestones, locale }: MilestoneTimelineProps) {
  if (milestones.length === 0) {
    return (
      <p className="text-secondary-500 text-sm italic">
        {locale === 'es' ? 'No hay hitos registrados.' : 'No milestones recorded.'}
      </p>
    );
  }

  const sorted = [...milestones].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-0">
      {sorted.map((milestone, index) => (
        <MilestoneItem
          key={milestone.id}
          milestone={milestone}
          locale={locale}
          isLast={index === sorted.length - 1}
        />
      ))}
    </div>
  );
}
