import Link from 'next/link';
import { ShoppingCart, Package } from 'lucide-react';
import { ProductWithCategory } from '@/db/schema';
import { StarRating } from '@/components/ui/StarRating';
import { Badge } from '@/components/ui/Badge';
import { formatPrice } from '@/lib/utils';

interface ProductCardProps {
  product: ProductWithCategory;
}

export function ProductCard({ product }: ProductCardProps) {
  const isOutOfStock = product.stockQty === 0;

  return (
    <article
      className='group flex flex-col rounded-xl border border-border bg-surface hover:shadow-lg transition-shadow duration-normal overflow-hidden'
      aria-label={product.name}
    >
      <Link
        href={`/products/${product.slug}`}
        className='block relative bg-bg-secondary aspect-[4/3] overflow-hidden'
        tabIndex={-1}
        aria-hidden='true'
      >
        <div className='absolute inset-0 flex items-center justify-center'>
          <Package
            className='h-16 w-16 text-text-tertiary group-hover:text-primary transition-colors duration-normal'
            aria-hidden='true'
          />
        </div>
        {isOutOfStock && (
          <div className='absolute inset-0 bg-black/40 flex items-center justify-center'>
            <span className='text-white text-sm font-semibold bg-black/60 px-3 py-1 rounded-full'>
              Out of Stock
            </span>
          </div>
        )}
      </Link>

      {/*  Content  */}
      <div className='flex flex-col flex-1 p-4 gap-3'>
        {/* Category badge */}
        {product.category && (
          <Link
            href={`/categories/${product.category.slug}`}
            className='w-fit'
            tabIndex={-1}
          >
            <Badge variant='info' className='text-xs'>
              {product.category.name}
            </Badge>
          </Link>
        )}

        {/* Name */}
        <Link href={`/products/${product.slug}`} className='group/link'>
          <h3 className='font-semibold text-text-primary text-sm leading-snug truncate-2 group-hover/link:text-primary transition-colors duration-fast'>
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        {product.averageRating != null && (
          <div className='flex items-center gap-2'>
            <StarRating rating={product.averageRating} size='sm' showValue />
            {product.approvedReviewsCount != null && (
              <span className='text-xs text-text-tertiary'>
                ({product.approvedReviewsCount})
              </span>
            )}
          </div>
        )}

        {/* Price and CTA */}
        <div className='flex items-center justify-between mt-auto pt-2 border-t border-border'>
          <span className='text-lg font-bold text-text-primary'>
            {formatPrice(Number(product.price))}
          </span>
          <Link
            href={`/products/${product.slug}`}
            className='inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary text-text-inverse text-xs font-medium hover:bg-primary-hover transition-colors duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary'
            aria-label={`View ${product.name}`}
          >
            <ShoppingCart className='h-3.5 w-3.5' aria-hidden='true' />
            View
          </Link>
        </div>
      </div>
    </article>
  );
}
