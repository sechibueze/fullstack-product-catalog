import { Skeleton } from '@/components/ui/Skeleton';
import { ProductCardSkeleton } from '@/components/ui/Skeleton';

export default function CategoryDetailLoading() {
  return (
    <div className='py-8 md:py-12'>
      <div className='container-app'>
        {/* Breadcrumb */}
        <div className='flex gap-2 mb-6'>
          <Skeleton className='h-4 w-12' />
          <Skeleton className='h-4 w-4' />
          <Skeleton className='h-4 w-24' />
          <Skeleton className='h-4 w-4' />
          <Skeleton className='h-4 w-28' />
        </div>

        {/* Header */}
        <div className='mb-10 p-6 rounded-2xl border border-border bg-bg-secondary'>
          <div className='flex items-start gap-4'>
            <Skeleton className='h-12 w-12 rounded-xl shrink-0' />
            <div className='flex-1 space-y-3'>
              <Skeleton className='h-8 w-48' />
              <Skeleton className='h-4 w-full' />
              <Skeleton className='h-4 w-3/4' />
            </div>
          </div>
        </div>

        {/* Products grid */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
