'use client';
import { useEffect } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function PublicError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('[PublicError]', error);
  }, [error]);

  return (
    <section role='alert' className='container-app py-24 text-center'>
      <AlertTriangle
        className='h-12 w-12 text-warning mx-auto mb-4'
        aria-hidden='true'
      />
      <h2 className='text-2xl font-bold text-text-primary mb-3'>Page error</h2>
      <p className='text-text-secondary mb-8 max-w-md mx-auto'>
        {process.env.NODE_ENV === 'development'
          ? error.message
          : 'Something went wrong loading this page.'}
      </p>
      <div className='flex items-center justify-center gap-3'>
        <Button onClick={reset} variant='primary' size='sm'>
          <RefreshCw className='h-4 w-4' aria-hidden='true' />
          Try again
        </Button>
        <Link href='/'>
          <Button variant='outline' size='sm'>
            <Home className='h-4 w-4' aria-hidden='true' />
            Go home
          </Button>
        </Link>
      </div>
    </section>
  );
}
