'use client';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useCallback, useTransition, useRef, useEffect } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { CategoryWithCount } from '@/db/schema';
import { cn } from '@/lib/utils';

interface ProductFiltersProps {
  categories: CategoryWithCount[];
  currentCategory: string;
  currentSearch: string;
}

export function ProductFilters({
  categories,
  currentCategory,
  currentSearch,
}: ProductFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const searchRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });

      // Reset to page 1 on filter change
      params.set('page', '1');

      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`);
      });
    },
    [pathname, router, searchParams],
  );

  const handleCategoryChange = (slug: string) => {
    updateParams({ category: slug });
  };

  const handleSearchChange = (value: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      updateParams({ search: value });
    }, 400);
  };

  const handleClear = () => {
    if (searchRef.current) searchRef.current.value = '';
    startTransition(() => {
      router.push(pathname);
    });
  };

  const hasFilters = currentCategory || currentSearch;

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row gap-4',
        'p-4 rounded-xl border border-border bg-bg-secondary',
        isPending && 'opacity-70 pointer-events-none',
      )}
      aria-label='Product filters'
    >
      {/*  Search  */}
      <div className='relative flex-1'>
        <Search
          className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-tertiary'
          aria-hidden='true'
        />
        <input
          ref={searchRef}
          type='search'
          placeholder='Search products...'
          defaultValue={currentSearch}
          onChange={(e) => handleSearchChange(e.target.value)}
          aria-label='Search products'
          className={cn(
            'w-full pl-9 pr-4 py-2.5 rounded-md',
            'border border-border bg-surface',
            'text-sm text-text-primary placeholder:text-text-tertiary',
            'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
            'transition-colors duration-fast',
          )}
        />
      </div>

      {/*  Category filter  */}
      <div className='relative'>
        <SlidersHorizontal
          className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-tertiary'
          aria-hidden='true'
        />
        <select
          value={currentCategory}
          onChange={(e) => handleCategoryChange(e.target.value)}
          aria-label='Filter by category'
          className={cn(
            'w-full sm:w-48 pl-9 pr-8 py-2.5 rounded-md',
            'border border-border bg-surface',
            'text-sm text-text-primary',
            'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
            'transition-colors duration-fast',
            'appearance-none cursor-pointer',
          )}
        >
          <option value=''>All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.slug}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/*  Clear filters  */}
      {hasFilters && (
        <button
          onClick={handleClear}
          aria-label='Clear all filters'
          className={cn(
            'inline-flex items-center gap-2 px-4 py-2.5 rounded-md',
            'border border-border bg-surface',
            'text-sm text-text-secondary hover:text-danger hover:border-danger',
            'transition-colors duration-fast',
            'whitespace-nowrap',
          )}
        >
          <X className='h-4 w-4' aria-hidden='true' />
          Clear
        </button>
      )}
    </div>
  );
}
