import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaginationProps {
  currentPage: number;
  lastPage: number;
  baseUrl: string;
  searchParams?: Record<string, string>;
  onPageChange?: (page: number) => void;
}

export function Pagination({
  currentPage,
  lastPage,
  baseUrl,
  searchParams = {},
  onPageChange,
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

  const pageButtonClass = (active: boolean) =>
    cn(
      'inline-flex items-center justify-center h-9 w-9 rounded-md',
      'text-sm font-medium transition-colors duration-fast',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
      active
        ? 'bg-primary text-text-inverse pointer-events-none'
        : 'border border-border text-text-secondary hover:bg-bg-secondary hover:text-primary',
    );

  const navButtonClass = (disabled: boolean) =>
    cn(
      'inline-flex items-center justify-center h-9 w-9 rounded-md',
      'border border-border transition-colors duration-fast',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
      disabled
        ? 'text-text-tertiary opacity-50 cursor-not-allowed'
        : 'text-text-secondary hover:bg-bg-secondary hover:text-primary',
    );

  // Render a page item as button (CSR) or Link (SSG/ISR)
  const renderPage = (page: number) => {
    const isActive = page === currentPage;

    if (onPageChange) {
      return (
        <button
          key={page}
          onClick={() => !isActive && onPageChange(page)}
          aria-label={`Page ${page}`}
          aria-current={isActive ? 'page' : undefined}
          className={pageButtonClass(isActive)}
        >
          {page}
        </button>
      );
    }

    return (
      <Link
        key={page}
        href={buildUrl(page)}
        aria-label={`Page ${page}`}
        aria-current={isActive ? 'page' : undefined}
        className={pageButtonClass(isActive)}
      >
        {page}
      </Link>
    );
  };

  // Render prev/next as button (CSR) or Link (SSG/ISR)
  const renderPrev = () => {
    if (onPageChange) {
      return (
        <button
          onClick={() => hasPrev && onPageChange(currentPage - 1)}
          disabled={!hasPrev}
          aria-label='Previous page'
          className={navButtonClass(!hasPrev)}
        >
          <ChevronLeft className='h-4 w-4' aria-hidden='true' />
        </button>
      );
    }

    return hasPrev ? (
      <Link
        href={buildUrl(currentPage - 1)}
        aria-label='Previous page'
        className={navButtonClass(false)}
      >
        <ChevronLeft className='h-4 w-4' aria-hidden='true' />
      </Link>
    ) : (
      <span aria-disabled='true' className={navButtonClass(true)}>
        <ChevronLeft className='h-4 w-4' aria-hidden='true' />
      </span>
    );
  };

  const renderNext = () => {
    if (onPageChange) {
      return (
        <button
          onClick={() => hasNext && onPageChange(currentPage + 1)}
          disabled={!hasNext}
          aria-label='Next page'
          className={navButtonClass(!hasNext)}
        >
          <ChevronRight className='h-4 w-4' aria-hidden='true' />
        </button>
      );
    }

    return hasNext ? (
      <Link
        href={buildUrl(currentPage + 1)}
        aria-label='Next page'
        className={navButtonClass(false)}
      >
        <ChevronRight className='h-4 w-4' aria-hidden='true' />
      </Link>
    ) : (
      <span aria-disabled='true' className={navButtonClass(true)}>
        <ChevronRight className='h-4 w-4' aria-hidden='true' />
      </span>
    );
  };

  return (
    <nav
      aria-label='Pagination'
      className='flex items-center justify-center gap-1 mt-8'
    >
      {renderPrev()}

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
          renderPage(page)
        ),
      )}

      {renderNext()}
    </nav>
  );
}
