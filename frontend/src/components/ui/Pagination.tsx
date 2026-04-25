import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaginationProps {
  currentPage: number;
  lastPage: number;
  baseUrl: string;
  searchParams?: Record<string, string>;
}

export function Pagination({
  currentPage,
  lastPage,
  baseUrl,
  searchParams = {},
}: PaginationProps) {
  if (lastPage <= 1) return null;

  const buildUrl = (page: number) => {
    const params = new URLSearchParams();
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    params.set('page', String(page));
    return `${baseUrl}?${params.toString()}`;
  };

  // Generate page numbers to show
  const pages: (number | 'ellipsis')[] = [];
  const delta = 2;

  for (let i = 1; i <= lastPage; i++) {
    if (
      i === 1 ||
      i === lastPage ||
      (i >= currentPage - delta && i <= currentPage + delta)
    ) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== 'ellipsis') {
      pages.push('ellipsis');
    }
  }

  const hasPrev = currentPage > 1;
  const hasNext = currentPage < lastPage;

  return (
    <nav
      aria-label='Pagination'
      className='flex items-center justify-center gap-1 mt-8'
    >
      {/* Previous */}
      {hasPrev ? (
        <Link
          href={buildUrl(currentPage - 1)}
          aria-label='Previous page'
          className={cn(
            'inline-flex items-center justify-center h-9 w-9 rounded-md',
            'border border-border text-text-secondary',
            'hover:bg-bg-secondary hover:text-primary',
            'transition-colors duration-fast',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
          )}
        >
          <ChevronLeft className='h-4 w-4' aria-hidden='true' />
        </Link>
      ) : (
        <span
          aria-disabled='true'
          className='inline-flex items-center justify-center h-9 w-9 rounded-md border border-border text-text-tertiary opacity-50 cursor-not-allowed'
        >
          <ChevronLeft className='h-4 w-4' aria-hidden='true' />
        </span>
      )}

      {/* Page numbers */}
      {pages.map((page, i) =>
        page === 'ellipsis' ? (
          <span
            key={`ellipsis-${i}`}
            aria-hidden='true'
            className='inline-flex items-center justify-center h-9 w-9 text-text-tertiary text-sm'
          >
            …
          </span>
        ) : (
          <Link
            key={page}
            href={buildUrl(page)}
            aria-label={`Page ${page}`}
            aria-current={page === currentPage ? 'page' : undefined}
            className={cn(
              'inline-flex items-center justify-center h-9 w-9 rounded-md',
              'text-sm font-medium',
              'transition-colors duration-fast',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
              page === currentPage
                ? 'bg-primary text-text-inverse pointer-events-none'
                : 'border border-border text-text-secondary hover:bg-bg-secondary hover:text-primary',
            )}
          >
            {page}
          </Link>
        ),
      )}

      {/* Next */}
      {hasNext ? (
        <Link
          href={buildUrl(currentPage + 1)}
          aria-label='Next page'
          className={cn(
            'inline-flex items-center justify-center h-9 w-9 rounded-md',
            'border border-border text-text-secondary',
            'hover:bg-bg-secondary hover:text-primary',
            'transition-colors duration-fast',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
          )}
        >
          <ChevronRight className='h-4 w-4' aria-hidden='true' />
        </Link>
      ) : (
        <span
          aria-disabled='true'
          className='inline-flex items-center justify-center h-9 w-9 rounded-md border border-border text-text-tertiary opacity-50 cursor-not-allowed'
        >
          <ChevronRight className='h-4 w-4' aria-hidden='true' />
        </span>
      )}
    </nav>
  );
}
