import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { getProduct, getAllProductSlugs } from '@/services/products';
import { StarRating } from '@/components/ui/StarRating';
import { Badge } from '@/components/ui/Badge';
import { ErrorBoundary } from '@/components/errors/ErrorBoundary';
import { ReviewsList } from '@/components/reviews/ReviewsList';
import { ReviewForm } from '@/components/reviews/ReviewForm';
import { ReviewsListSkeleton } from '@/components/ui/Skeleton';
import { formatPrice } from '@/lib/utils';
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd';
import {
  Package,
  Tag,
  ShoppingCart,
  CheckCircle,
  XCircle,
  ArrowLeft,
} from 'lucide-react';
import Link from 'next/link';

// pre-renders all published slugs at build time
export async function generateStaticParams() {
  const slugs = await getAllProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

// revalidate 60s for products
export const revalidate = 60;

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

// generateMetadata for SEO
export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return { title: 'Product Not Found' };
  }

  return {
    title: product.name,
    description:
      product.description ?? `Buy ${product.name} at the best price.`,
    openGraph: {
      title: product.name,
      description: product.description ?? `Buy ${product.name}`,
      type: 'website',
      url: `/products/${slug}`,
    },
    //structured data to enhanceSEO results
    other: {
      'application/ld+json': JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        description: product.description,
        offers: {
          '@type': 'Offer',
          price: product.price,
          priceCurrency: 'USD',
          availability:
            product.stockQty > 0
              ? 'https://schema.org/InStock'
              : 'https://schema.org/OutOfStock',
        },
        ...(product.averageRating && {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: product.averageRating,
            reviewCount: product.approvedReviewsCount ?? 0,
            bestRating: 5,
            worstRating: 1,
          },
        }),
      }),
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);
  // handle unpublished or missing slugs
  if (!product || !product.isPublished) {
    notFound();
  }

  const isInStock = product.stockQty > 0;
  const approvedReviews = product.reviews?.data ?? [];
  const averageRating = product.averageRating ?? 0;
  const reviewCount = product.approvedReviewsCount ?? 0;

  return (
    <>
      {/* JSON-LD structured data */}
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: product.name,
            description: product.description,
            offers: {
              '@type': 'Offer',
              price: product.price,
              priceCurrency: 'USD',
              availability: isInStock
                ? 'https://schema.org/InStock'
                : 'https://schema.org/OutOfStock',
            },
          }),
        }}
      />
      {/* Breadcrumb structured data */}
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', href: '/' },
          { name: 'Products', href: '/products' },
          { name: product.name, href: `/products/${product.slug}` },
        ]}
      />
      <div className='py-8 md:py-12'>
        <div className='container-app'>
          {/*  Breadcrumb  */}
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
                  href='/products'
                  className='hover:text-primary transition-colors duration-fast'
                >
                  Products
                </Link>
              </li>
              <li aria-hidden='true'>/</li>
              <li
                className='text-text-primary font-medium truncate max-w-[200px]'
                aria-current='page'
              >
                {product.name}
              </li>
            </ol>
          </nav>

          {/* Back button */}
          <Link
            href='/products'
            className='inline-flex items-center gap-2 text-sm text-text-secondary hover:text-primary transition-colors duration-fast mb-8'
          >
            <ArrowLeft className='h-4 w-4' aria-hidden='true' />
            Back to products
          </Link>

          {/* Product detail */}
          <article className='grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12'>
            {/*  Image area  */}
            <div className='rounded-2xl bg-bg-secondary border border-border aspect-square flex items-center justify-center'>
              <Package
                className='h-32 w-32 text-text-tertiary'
                aria-hidden='true'
              />
            </div>

            {/* Product Info area */}
            <div className='flex flex-col gap-5'>
              {/* Category */}
              {product.category && (
                <Link href={`/categories/${product.category.slug}`}>
                  <Badge variant='info' className='w-fit'>
                    <Tag className='h-3 w-3 mr-1' aria-hidden='true' />
                    {product.category.name}
                  </Badge>
                </Link>
              )}

              {/* Name */}
              <h1 className='text-3xl md:text-4xl font-bold text-text-primary leading-tight'>
                {product.name}
              </h1>

              {/* Rating summary */}
              {reviewCount > 0 && (
                <div className='flex items-center gap-3'>
                  <StarRating rating={averageRating} size='md' showValue />
                  <span className='text-sm text-text-secondary'>
                    ({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})
                  </span>
                </div>
              )}

              {/* Price */}
              <div className='flex items-baseline gap-3'>
                <span className='text-4xl font-bold text-text-primary'>
                  {formatPrice(Number(product.price))}
                </span>
              </div>

              {/* Stock status */}
              <div className='flex items-center gap-2'>
                {isInStock ? (
                  <>
                    <CheckCircle
                      className='h-5 w-5 text-success'
                      aria-hidden='true'
                    />
                    <span className='text-sm font-medium text-success'>
                      In Stock ({product.stockQty} available)
                    </span>
                  </>
                ) : (
                  <>
                    <XCircle
                      className='h-5 w-5 text-danger'
                      aria-hidden='true'
                    />
                    <span className='text-sm font-medium text-danger'>
                      Out of Stock
                    </span>
                  </>
                )}
              </div>

              {/* Divider */}
              <hr className='border-border' />

              {/* Description */}
              {product.description && (
                <div>
                  <h2 className='text-sm font-semibold text-text-primary mb-2 uppercase tracking-wide'>
                    Description
                  </h2>
                  <p className='text-text-secondary leading-relaxed text-sm'>
                    {product.description}
                  </p>
                </div>
              )}

              {/* CTA */}
              <button
                disabled={!isInStock}
                aria-label={
                  isInStock ? `Add ${product.name} to cart` : 'Out of stock'
                }
                className='inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3 rounded-md bg-primary text-text-inverse font-semibold hover:bg-primary-hover transition-colors duration-fast disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary'
              >
                <ShoppingCart className='h-5 w-5' aria-hidden='true' />
                {isInStock ? 'Add to Cart' : 'Out of Stock'}
              </button>
            </div>
          </article>

          {/*  Reviews section  */}
          <section
            aria-labelledby='reviews-heading'
            className='mt-16 border-t border-border pt-12'
          >
            <h2
              id='reviews-heading'
              className='text-2xl font-bold text-text-primary mb-8'
            >
              Customer Reviews
              {reviewCount > 0 && (
                <span className='ml-2 text-lg font-normal text-text-secondary'>
                  ({reviewCount})
                </span>
              )}
            </h2>

            <div className='grid grid-cols-1 lg:grid-cols-3 gap-12'>
              {/* Reviews list */}
              <div className='lg:col-span-2'>
                <ErrorBoundary
                  fallback={
                    <p className='text-text-secondary'>
                      Unable to load reviews right now.
                    </p>
                  }
                >
                  <Suspense fallback={<ReviewsListSkeleton />}>
                    <ReviewsList reviews={approvedReviews} />
                  </Suspense>
                </ErrorBoundary>
              </div>

              {/* Review form */}
              <div className='lg:col-span-1'>
                <div className='sticky top-24'>
                  <h3 className='text-lg font-semibold text-text-primary mb-4'>
                    Write a Review
                  </h3>
                  <ErrorBoundary>
                    <ReviewForm productSlug={product.slug} />
                  </ErrorBoundary>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
