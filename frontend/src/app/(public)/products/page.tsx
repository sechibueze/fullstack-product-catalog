import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getProducts } from '@/services/products';
import { getCategories } from '@/services/categories';
import { ProductCard } from '@/components/products/ProductCard';
import { ProductCardSkeleton } from '@/components/ui/Skeleton';
import { ErrorBoundary } from '@/components/errors/ErrorBoundary';
import { ProductFilters } from '@/components/products/ProductFilters';
import { Pagination } from '@/components/ui/Pagination';
import { Package } from 'lucide-react';

export const metadata: Metadata = {
  title: 'All Products',
  description:
    'Browse our full catalog of quality products across all categories.',
  openGraph: {
    title: 'All Products | Product Catalog',
    description: 'Browse our full catalog of quality products.',
    type: 'website',
  },
};

// revalidate is handled at fetch level
export const revalidate = 60;

interface ProductsPageProps {
  searchParams: Promise<{
    page?: string;
    category?: string;
    search?: string;
    per_page?: string;
  }>;
}

async function ProductsGrid({
  page,
  category,
  search,
  perPage,
}: {
  page: string;
  category: string;
  search: string;
  perPage: string;
}) {
  const params: Record<string, string> = { page, per_page: perPage };
  if (category) params.category = category;
  if (search) params.search = search;

  const data = await getProducts(params);

  if (!data.data.length) {
    return (
      <div className='flex flex-col items-center justify-center py-24 text-center'>
        <Package
          className='h-16 w-16 text-text-tertiary mb-4'
          aria-hidden='true'
        />
        <h2 className='text-xl font-semibold text-text-primary mb-2'>
          No products found
        </h2>
        <p className='text-text-secondary text-sm max-w-sm'>
          {search || category
            ? 'Try adjusting your filters or search term.'
            : 'No products are available yet.'}
        </p>
      </div>
    );
  }

  return (
    <div className='space-y-8'>
      {/* Results count */}
      <p className='text-sm text-text-secondary'>
        Showing{' '}
        <span className='font-medium text-text-primary'>
          {data.meta.from} - {data.meta.to}
        </span>{' '}
        of{' '}
        <span className='font-medium text-text-primary'>{data.meta.total}</span>{' '}
        products
      </p>

      {/* Grid with 1-col mobile, 2-col tablet, 3-4 col desktop */}
      <div
        className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
        aria-label='Products list'
      >
        {data.data.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={data.meta.currentPage}
        lastPage={data.meta.lastPage}
        baseUrl='/products'
        searchParams={{ category, search, per_page: perPage }}
      />
    </div>
  );
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const params = await searchParams;
  const page = params.page ?? '1';
  const category = params.category ?? '';
  const search = params.search ?? '';
  const perPage = params.per_page ?? '12';

  // Fetch categories for filter dropdown
  const categoriesData = await getCategories({ per_page: '100' });

  return (
    <div className='py-8 md:py-12'>
      <div className='container-app'>
        {/*  Page header  */}
        <div className='mb-8'>
          <h1 className='text-3xl md:text-4xl font-bold text-text-primary mb-2'>
            All Products
          </h1>
          <p className='text-text-secondary'>
            Discover our full range of quality products.
          </p>
        </div>

        {/*  Filters  */}
        <ProductFilters
          categories={categoriesData.data}
          currentCategory={category}
          currentSearch={search}
        />

        {/*  Products grid  */}
        <div className='mt-8'>
          <ErrorBoundary
            fallback={
              <p className='text-center text-text-secondary py-12'>
                Unable to load products. Please try again.
              </p>
            }
          >
            <Suspense
              key={`${page}-${category}-${search}`}
              fallback={
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                  {Array.from({ length: 12 }).map((_, i) => (
                    <ProductCardSkeleton key={i} />
                  ))}
                </div>
              }
            >
              <ProductsGrid
                page={page}
                category={category}
                search={search}
                perPage={perPage}
              />
            </Suspense>
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
}
