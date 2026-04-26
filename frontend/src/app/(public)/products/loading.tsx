import { ProductCardSkeleton } from '@/components/ui/Skeleton';

export default function ProductsLoading() {
  return (
    <div className='py-8 md:py-12'>
      <div className='container-app'>
        {/* Header skeleton */}
        <div className='mb-8 space-y-2'>
          <div className='h-10 w-48 bg-bg-tertiary rounded-md animate-pulse' />
          <div className='h-5 w-72 bg-bg-tertiary rounded-md animate-pulse' />
        </div>

        {/* Filter skeleton */}
        <div className='h-14 w-full bg-bg-tertiary rounded-xl animate-pulse' />

        {/* Grid skeleton */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8'>
          {Array.from({ length: 12 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
