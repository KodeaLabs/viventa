import { ProjectCard } from '../molecules/ProjectCard';
import type { ProjectListItem } from '@/types';

interface ProjectGridProps {
  projects: ProjectListItem[];
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
    featured: string;
    noProjects: string;
  };
}

export function ProjectGrid({ projects, locale, translations }: ProjectGridProps) {
  if (projects.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary-100 flex items-center justify-center">
          <svg className="w-8 h-8 text-secondary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 7.5h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
          </svg>
        </div>
        <p className="text-secondary-500 text-lg">{translations.noProjects}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          locale={locale}
          translations={translations}
        />
      ))}
    </div>
  );
}
