'use client';

import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse bg-secondary-200 rounded',
        className
      )}
    />
  );
}

export function PropertyCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-card overflow-hidden">
      {/* Image placeholder */}
      <Skeleton className="aspect-[4/3] rounded-none" />

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <Skeleton className="h-6 w-3/4" />

        {/* Location */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-1/2" />
        </div>

        {/* Price */}
        <Skeleton className="h-8 w-1/3 mt-2" />

        {/* Features */}
        <div className="flex gap-4 pt-4 border-t border-secondary-100">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </div>
  );
}

export function PropertyGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <PropertyCardSkeleton key={i} />
      ))}
    </div>
  );
}
