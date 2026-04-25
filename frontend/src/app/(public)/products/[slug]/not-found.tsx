import Link from 'next/link';
import { PackageSearch, ArrowLeft } from 'lucide-react';

export default function ProductNotFound() {
  return (
    <section className='container-app py-24 text-center'>
      <PackageSearch
        className='h-16 w-16 text-text-tertiary mx-auto mb-4'
        aria-hidden='true'
      />
      <h2 className='text-2xl font-bold text-text-primary mb-3'>
        Product not found
      </h2>
      <p className='text-text-secondary mb-8 max-w-sm mx-auto'>
        This product does not exist or is no longer available.
      </p>
      <Link
        href='/products'
        className='inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-text-inverse text-sm font-medium hover:bg-primary-hover transition-colors duration-fast'
      >
        <ArrowLeft className='h-4 w-4' aria-hidden='true' />
        Back to products
      </Link>
    </section>
  );
}
