import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getCategories } from '@/services/categories';
import { CategoryCard } from '@/components/categories/CategoryCard';
import { CategoryCardSkeleton } from '@/components/ui/Skeleton';
import { ErrorBoundary } from '@/components/errors/ErrorBoundary';
import { Tag } from 'lucide-react';

// static at build time
export const dynamic = 'force-static';
export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Categories',
  description:
    'Browse all product categories and find exactly what you are looking for.',
  openGraph: {
    title: 'Product Categories',
    description: 'Browse all product categories.',
    type: 'website',
  },
};

async function CategoriesGrid() {
  const data = await getCategories({ per_page: '100' });

  if (!data.data.length) {
    return (
      <div className='flex flex-col items-center justify-center py-24 text-center'>
        <Tag className='h-16 w-16 text-text-tertiary mb-4' aria-hidden='true' />
        <h2 className='text-xl font-semibold text-text-primary mb-2'>
          No categories yet
        </h2>
        <p className='text-text-secondary text-sm'>
          Categories will appear here once they are added.
        </p>
      </div>
    );
  }

  return (
    <div
      className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
      aria-label='Product categories'
    >
      {data.data.map((category) => (
        <CategoryCard key={category.id} category={category} />
      ))}
    </div>
  );
}

export default function CategoriesPage() {
  return (
    <div className='py-8 md:py-12'>
      <div className='container-app'>
        {/* Page header  */}
        <div className='mb-10'>
          <h1 className='text-3xl md:text-4xl font-bold text-text-primary mb-2'>
            All Categories
          </h1>
          <p className='text-text-secondary'>
            Browse our product categories and find what you need.
          </p>
        </div>

        {/* Categories grid */}
        <ErrorBoundary
          fallback={
            <p className='text-center text-text-secondary py-12'>
              Unable to load categories. Please try again.
            </p>
          }
        >
          <Suspense
            fallback={
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                {Array.from({ length: 6 }).map((_, i) => (
                  <CategoryCardSkeleton key={i} />
                ))}
              </div>
            }
          >
            <CategoriesGrid />
          </Suspense>
        </ErrorBoundary>
      </div>
    </div>
  );
}
