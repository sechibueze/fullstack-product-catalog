import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { ArrowRight, ShoppingBag, Star, Shield } from 'lucide-react';
import { getFeaturedProducts } from '@/services/products';
import { getCategories } from '@/services/categories';
import { ProductCard } from '@/components/products/ProductCard';
import { CategoryCard } from '@/components/categories/CategoryCard';
import {
  ProductCardSkeleton,
  CategoryCardSkeleton,
} from '@/components/ui/Skeleton';
import { ErrorBoundary } from '@/components/errors/ErrorBoundary';

// revalidation is handled at fetch level in services
export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Product Catalog | Quality Products, Honest Reviews',
  description:
    'Discover our curated collection of quality products with honest customer reviews and competitive prices.',
  openGraph: {
    title: 'Product Catalog',
    description: 'Discover quality products with honest reviews.',
    type: 'website',
  },
};

const FEATURES = [
  {
    icon: ShoppingBag,
    title: 'Curated Products',
    body: 'Hand-picked products across multiple categories.',
  },
  {
    icon: Star,
    title: 'Verified Reviews',
    body: 'All reviews are moderated for authenticity.',
  },
  {
    icon: Shield,
    title: 'Quality Guaranteed',
    body: 'Every product meets our quality standards.',
  },
];

// Async sections
async function FeaturedProducts() {
  const data = await getFeaturedProducts();

  if (!data.data.length) {
    return (
      <p className='text-text-secondary text-center py-12'>
        No products available yet.
      </p>
    );
  }

  return (
    <div
      className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
      aria-label='Featured products'
    >
      {data.data.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

async function FeaturedCategories() {
  const data = await getCategories({ per_page: '6' });

  if (!data.data.length) return null;

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

// Page
export default function HomePage() {
  return (
    <>
      {/* Hero  */}
      <section
        aria-labelledby='hero-heading'
        className='bg-gradient-to-br from-primary-light via-bg to-secondary-light py-20 md:py-32'
      >
        <div className='container-app text-center'>
          <h1
            id='hero-heading'
            className='text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary mb-6 leading-tight'
          >
            Discover Quality <span className='text-primary'>Products</span>
          </h1>
          <p className='text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed'>
            Browse our curated catalog with honest customer reviews and
            competitive prices across all categories.
          </p>
          <div className='flex flex-col sm:flex-row items-center justify-center gap-4'>
            <Link
              href='/products'
              className='inline-flex items-center gap-2 px-8 py-3 rounded-md bg-primary text-text-inverse font-semibold hover:bg-primary-hover transition-colors duration-fast text-base'
            >
              Browse Products
              <ArrowRight className='h-5 w-5' aria-hidden='true' />
            </Link>
            <Link
              href='/categories'
              className='inline-flex items-center gap-2 px-8 py-3 rounded-md border border-border text-text-primary font-semibold hover:bg-bg-secondary transition-colors duration-fast text-base'
            >
              View Categories
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section
        aria-labelledby='features-heading'
        className='py-16 bg-bg-secondary'
      >
        <div className='container-app'>
          <h2 id='features-heading' className='sr-only'>
            Why choose us
          </h2>
          <div className='grid grid-cols-1 sm:grid-cols-3 gap-8'>
            {FEATURES.map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className='flex flex-col items-center text-center p-6'
              >
                <div className='h-12 w-12 rounded-xl bg-primary-light flex items-center justify-center mb-4'>
                  <Icon className='h-6 w-6 text-primary' aria-hidden='true' />
                </div>
                <h3 className='text-base font-semibold text-text-primary mb-2'>
                  {title}
                </h3>
                <p className='text-sm text-text-secondary leading-relaxed'>
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products  */}
      <section aria-labelledby='products-heading' className='py-16'>
        <div className='container-app'>
          <div className='flex items-center justify-between mb-8'>
            <h2
              id='products-heading'
              className='text-2xl md:text-3xl font-bold text-text-primary'
            >
              Featured Products
            </h2>
            <Link
              href='/products'
              className='inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-hover transition-colors'
              aria-label='View all products'
            >
              View all
              <ArrowRight className='h-4 w-4' aria-hidden='true' />
            </Link>
          </div>

          <ErrorBoundary
            fallback={
              <p className='text-text-secondary text-center py-12'>
                Unable to load products right now.
              </p>
            }
          >
            <Suspense
              fallback={
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                  {Array.from({ length: 8 }).map((_, i) => (
                    <ProductCardSkeleton key={i} />
                  ))}
                </div>
              }
            >
              <FeaturedProducts />
            </Suspense>
          </ErrorBoundary>
        </div>
      </section>

      {/*  Categories */}
      <section
        aria-labelledby='categories-heading'
        className='py-16 bg-bg-secondary'
      >
        <div className='container-app'>
          <div className='flex items-center justify-between mb-8'>
            <h2
              id='categories-heading'
              className='text-2xl md:text-3xl font-bold text-text-primary'
            >
              Shop by Category
            </h2>
            <Link
              href='/categories'
              className='inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-hover transition-colors'
              aria-label='View all categories'
            >
              View all
              <ArrowRight className='h-4 w-4' aria-hidden='true' />
            </Link>
          </div>

          <ErrorBoundary
            fallback={
              <p className='text-text-secondary text-center py-12'>
                Unable to load categories right now.
              </p>
            }
          >
            <Suspense
              fallback={
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                  {Array.from({ length: 3 }).map((_, i) => (
                    <CategoryCardSkeleton key={i} />
                  ))}
                </div>
              }
            >
              <FeaturedCategories />
            </Suspense>
          </ErrorBoundary>
        </div>
      </section>

      {/* CTA */}
      <section aria-labelledby='cta-heading' className='py-20 bg-primary'>
        <div className='container-app text-center'>
          <h2
            id='cta-heading'
            className='text-3xl font-bold text-text-inverse mb-4'
          >
            Ready to start shopping?
          </h2>
          <p className='text-primary-light mb-8 text-lg'>
            Join thousands of happy customers today.
          </p>
          <Link
            href='/products'
            className='inline-flex items-center gap-2 px-8 py-3 rounded-md bg-white text-primary font-semibold hover:bg-gray-50 transition-colors duration-fast'
          >
            Shop Now
            <ArrowRight className='h-5 w-5' aria-hidden='true' />
          </Link>
        </div>
      </section>
    </>
  );
}
