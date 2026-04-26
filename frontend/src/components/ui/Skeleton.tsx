import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      aria-hidden='true'
      className={cn('animate-pulse rounded-md bg-bg-tertiary', className)}
    />
  );
}

// Product card skeleton
export function ProductCardSkeleton() {
  return (
    <div className='rounded-xl border border-border bg-surface p-4 space-y-3'>
      <Skeleton className='h-48 w-full rounded-lg' />
      <Skeleton className='h-4 w-3/4' />
      <Skeleton className='h-4 w-1/2' />
      <div className='flex justify-between items-center pt-2'>
        <Skeleton className='h-6 w-20' />
        <Skeleton className='h-8 w-24 rounded-md' />
      </div>
    </div>
  );
}

export function CategoryCardSkeleton() {
  return (
    <div className='rounded-xl border border-border bg-surface p-6 space-y-3'>
      <Skeleton className='h-6 w-1/2' />
      <Skeleton className='h-4 w-full' />
      <Skeleton className='h-4 w-3/4' />
      <Skeleton className='h-4 w-16' />
    </div>
  );
}

export function ReviewsListSkeleton() {
  return (
    <div className='space-y-4' aria-busy='true' aria-label='Loading reviews'>
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className='p-5 rounded-xl border border-border space-y-3'>
          <div className='flex justify-between'>
            <div className='flex items-center gap-3'>
              <Skeleton className='h-9 w-9 rounded-full' />
              <div className='space-y-1'>
                <Skeleton className='h-4 w-28' />
                <Skeleton className='h-3 w-20' />
              </div>
            </div>
            <Skeleton className='h-4 w-20' />
          </div>
          <Skeleton className='h-4 w-full' />
          <Skeleton className='h-4 w-4/5' />
        </div>
      ))}
    </div>
  );
}
