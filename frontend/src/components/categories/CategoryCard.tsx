import Link from 'next/link';
import { ArrowRight, Tag } from 'lucide-react';
import { CategoryWithCount } from '@/db/schema';
import { truncate } from '@/lib/utils';

interface CategoryCardProps {
  category: CategoryWithCount;
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <article
      className='group flex flex-col rounded-xl border border-border bg-surface p-6 hover:shadow-lg hover:border-primary transition-all duration-normal'
      aria-label={category.name}
    >
      {/* Icon */}
      <div className='h-10 w-10 rounded-lg bg-primary-light flex items-center justify-center mb-4'>
        <Tag className='h-5 w-5 text-primary' aria-hidden='true' />
      </div>

      {/* Name */}
      <h3 className='font-semibold text-text-primary text-lg mb-2 group-hover:text-primary transition-colors duration-fast'>
        {category.name}
      </h3>

      {/* Description */}
      {category.description && (
        <p className='text-sm text-text-secondary leading-relaxed mb-4 flex-1'>
          {truncate(category.description, 100)}
        </p>
      )}

      {/* Footer */}
      <div className='flex items-center justify-between mt-auto pt-4 border-t border-border'>
        <span className='text-xs text-text-tertiary'>
          {category.productsCount ?? 0}{' '}
          {category.productsCount === 1 ? 'product' : 'products'}
        </span>
        <Link
          href={`/categories/${category.slug}`}
          className='inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-hover transition-colors duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded'
          aria-label={`Browse ${category.name}`}
        >
          Browse
          <ArrowRight className='h-4 w-4' aria-hidden='true' />
        </Link>
      </div>
    </article>
  );
}
