import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { getCategory, getAllCategorySlugs } from '@/services/categories';
import { getProducts } from '@/services/products';
import { ProductCard } from '@/components/products/ProductCard';
import { ProductCardSkeleton } from '@/components/ui/Skeleton';
import { Pagination } from '@/components/ui/Pagination';
import { ErrorBoundary } from '@/components/errors/ErrorBoundary';
import { Badge } from '@/components/ui/Badge';
import { ArrowLeft, Package, Tag } from 'lucide-react';
import Link from 'next/link';

//  pre-renders all category slugs at build time
export async function generateStaticParams() {
  const slugs = await getAllCategorySlugs();
  return slugs.map((slug) => ({ slug }));
}

// revalidate 300s for categories
export const revalidate = 300;

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string; per_page?: string }>;
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategory(slug);

  if (!category) return { title: 'Category Not Found' };

  return {
    title: category.name,
    description:
      category.description ?? `Browse all products in ${category.name}.`,
    openGraph: {
      title: `${category.name} — Product Catalog`,
      description: category.description ?? `Browse ${category.name} products.`,
      type: 'website',
      url: `/categories/${slug}`,
    },
  };
}

async function CategoryProducts({
  categorySlug,
  page,
  perPage,
}: {
  categorySlug: string;
  page: string;
  perPage: string;
}) {
  const data = await getProducts({
    category: categorySlug,
    page,
    per_page: perPage,
  });

  if (!data.data.length) {
    return (
      <div className='flex flex-col items-center justify-center py-24 text-center'>
        <Package
          className='h-16 w-16 text-text-tertiary mb-4'
          aria-hidden='true'
        />
        <h2 className='text-xl font-semibold text-text-primary mb-2'>
          No products in this category
        </h2>
        <p className='text-text-secondary text-sm mb-8'>
          Products will appear here once they are added.
        </p>
        <Link
          href='/products'
          className='inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-text-inverse text-sm font-medium hover:bg-primary-hover transition-colors duration-fast'
        >
          Browse all products
        </Link>
      </div>
    );
  }

  return (
    <div className='space-y-8'>
      {/* Results count */}
      <p className='text-sm text-text-secondary'>
        Showing{' '}
        <span className='font-medium text-text-primary'>
          {data.meta.from}-{data.meta.to}
        </span>{' '}
        of{' '}
        <span className='font-medium text-text-primary'>{data.meta.total}</span>{' '}
        products
      </p>

      {/* Grid 1-col mobile, 2-col tablet, 3-4 col desktop */}
      <div
        className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
        aria-label={`Products in this category`}
      >
        {data.data.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={data.meta.currentPage}
        lastPage={data.meta.lastPage}
        baseUrl={`/categories/${categorySlug}`}
        searchParams={{ per_page: perPage }}
      />
    </div>
  );
}

export default async function CategoryDetailPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { slug } = await params;
  const sp = await searchParams;
  const page = sp.page ?? '1';
  const perPage = sp.per_page ?? '12';

  // notFound() for missing slugs
  const category = await getCategory(slug);
  if (!category) notFound();

  return (
    <div className='py-8 md:py-12'>
      <div className='container-app'>
        {/* Breadcrumb */}
        <nav aria-label='Breadcrumb' className='mb-6'>
          <ol
            role='list'
            className='flex items-center gap-2 text-sm text-text-secondary'
          >
            <li>
              <Link
                href='/'
                className='hover:text-primary transition-colors duration-fast'
              >
                Home
              </Link>
            </li>
            <li aria-hidden='true'>/</li>
            <li>
              <Link
                href='/categories'
                className='hover:text-primary transition-colors duration-fast'
              >
                Categories
              </Link>
            </li>
            <li aria-hidden='true'>/</li>
            <li className='text-text-primary font-medium' aria-current='page'>
              {category.name}
            </li>
          </ol>
        </nav>

        {/*  Back link */}
        <Link
          href='/categories'
          className='inline-flex items-center gap-2 text-sm text-text-secondary hover:text-primary transition-colors duration-fast mb-8'
        >
          <ArrowLeft className='h-4 w-4' aria-hidden='true' />
          All categories
        </Link>

        {/*  Category header */}
        <div className='mb-10 p-6 rounded-2xl border border-border bg-bg-secondary'>
          <div className='flex items-start gap-4'>
            <div className='h-12 w-12 rounded-xl bg-primary-light flex items-center justify-center shrink-0'>
              <Tag className='h-6 w-6 text-primary' aria-hidden='true' />
            </div>
            <div className='flex-1 min-w-0'>
              <div className='flex items-center gap-3 mb-2 flex-wrap'>
                <h1 className='text-3xl font-bold text-text-primary'>
                  {category.name}
                </h1>
                <Badge variant='info'>
                  {category.productsCount}{' '}
                  {category.productsCount === 1 ? 'product' : 'products'}
                </Badge>
              </div>
              {category.description && (
                <p className='text-text-secondary leading-relaxed'>
                  {category.description}
                </p>
              )}
            </div>
          </div>
        </div>

        {/*  Products  */}
        <ErrorBoundary
          fallback={
            <p className='text-center text-text-secondary py-12'>
              Unable to load products. Please try again.
            </p>
          }
        >
          <Suspense
            key={`${slug}-${page}`}
            fallback={
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                {Array.from({ length: 12 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            }
          >
            <CategoryProducts
              categorySlug={slug}
              page={page}
              perPage={perPage}
            />
          </Suspense>
        </ErrorBoundary>
      </div>
    </div>
  );
}
