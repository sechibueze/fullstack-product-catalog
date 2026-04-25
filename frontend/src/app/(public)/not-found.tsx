import Link from 'next/link';
import { PackageSearch } from 'lucide-react';

export default function PublicNotFound() {
  return (
    <section className='container-app py-24 text-center'>
      <PackageSearch
        className='h-16 w-16 text-text-tertiary mx-auto mb-4'
        aria-hidden='true'
      />
      <h2 className='text-2xl font-bold text-text-primary mb-3'>Not found</h2>
      <p className='text-text-secondary mb-8'>
        The resource you are looking for does not exist.
      </p>
      <Link
        href='/products'
        className='inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-text-inverse text-sm font-medium hover:bg-primary-hover transition-colors'
      >
        Browse products
      </Link>
    </section>
  );
}
