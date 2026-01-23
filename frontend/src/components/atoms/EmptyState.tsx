'use client';

import { cn } from '../../lib/utils';
import {
  HomeIcon,
  MagnifyingGlassIcon,
  HeartIcon,
  InboxIcon,
} from '@heroicons/react/24/outline';

interface EmptyStateProps {
  variant?: 'properties' | 'search' | 'saved' | 'inbox';
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

const icons = {
  properties: HomeIcon,
  search: MagnifyingGlassIcon,
  saved: HeartIcon,
  inbox: InboxIcon,
};

const colors = {
  properties: 'bg-primary-100 text-primary-600',
  search: 'bg-secondary-100 text-secondary-600',
  saved: 'bg-red-100 text-red-500',
  inbox: 'bg-accent-100 text-accent-600',
};

export function EmptyState({
  variant = 'properties',
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  const Icon = icons[variant];

  return (
    <div className={cn('text-center py-12 px-4', className)}>
      {/* Illustration */}
      <div className="relative mx-auto mb-6 w-24 h-24">
        {/* Background circles */}
        <div className="absolute inset-0 rounded-full bg-secondary-100 animate-pulse" />
        <div className="absolute inset-2 rounded-full bg-secondary-50" />

        {/* Icon */}
        <div className={cn(
          'absolute inset-4 rounded-full flex items-center justify-center',
          colors[variant]
        )}>
          <Icon className="w-8 h-8" />
        </div>

        {/* Decorative dots */}
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary-400 rounded-full" />
        <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-accent-300 rounded-full" />
      </div>

      {/* Text */}
      <h3 className="font-display text-xl font-semibold text-secondary-900 mb-2">
        {title}
      </h3>
      <p className="text-secondary-600 max-w-sm mx-auto mb-6">
        {description}
      </p>

      {/* Action */}
      {action && <div>{action}</div>}
    </div>
  );
}
