import Link from 'next/link';
import { PackageSearch, Home, ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404 | Page Not Found',
};

export default function NotFound() {
  return (
    <div className='min-h-screen flex items-center justify-center px-4'>
      <div className='text-center max-w-md'>
        <PackageSearch
          className='h-20 w-20 text-text-tertiary mx-auto mb-6'
          aria-hidden='true'
        />
        <h1 className='text-6xl font-bold text-primary mb-4'>404</h1>
        <h2 className='text-2xl font-semibold text-text-primary mb-3'>
          Page not found
        </h2>
        <p className='text-text-secondary mb-8'>
          The page you are looking for does not exist or has been moved.
        </p>
        <div className='flex items-center justify-center gap-3'>
          <Link
            href='/'
            className='inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-text-inverse text-sm font-medium hover:bg-primary-hover transition-colors duration-fast'
          >
            <Home className='h-4 w-4' aria-hidden='true' />
            Go home
          </Link>
          <Link
            href='/products'
            className='inline-flex items-center gap-2 px-4 py-2 rounded-md border border-border text-text-primary text-sm font-medium hover:bg-bg-secondary transition-colors duration-fast'
          >
            <ArrowLeft className='h-4 w-4' aria-hidden='true' />
            Browse products
          </Link>
        </div>
      </div>
    </div>
  );
}
