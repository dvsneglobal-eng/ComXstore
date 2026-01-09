
import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => (
  <div className={`bg-slate-200 animate-pulse rounded-2xl ${className}`} />
);

export const ProductSkeleton = () => (
  <div className="space-y-3">
    <Skeleton className="aspect-[4/5] rounded-[32px]" />
    <Skeleton className="h-4 w-3/4" />
    <Skeleton className="h-3 w-1/2" />
    <div className="flex justify-between items-center pt-2">
      <Skeleton className="h-6 w-1/4" />
      <Skeleton className="w-10 h-10 rounded-xl" />
    </div>
  </div>
);
