import { CategoryCardSkeleton } from '@/components/ui/Skeleton';

export default function CategoriesLoading() {
  return (
    <div className='py-8 md:py-12'>
      <div className='container-app'>
        <div className='mb-10 space-y-2'>
          <div className='h-10 w-48 bg-bg-tertiary rounded-md animate-pulse' />
          <div className='h-5 w-72 bg-bg-tertiary rounded-md animate-pulse' />
        </div>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
          {Array.from({ length: 6 }).map((_, i) => (
            <CategoryCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
