'use client';
import { useEffect } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('[GlobalError]', error);
    // We can send to the remote logger used at WFD
  }, [error]);

  return (
    <div
      role='alert'
      className='min-h-screen flex items-center justify-center px-4'
    >
      <div className='text-center max-w-md'>
        <AlertTriangle
          className='h-16 w-16 text-warning mx-auto mb-6'
          aria-hidden='true'
        />
        <h1 className='text-3xl font-bold text-text-primary mb-3'>
          Something went wrong
        </h1>
        <p className='text-text-secondary mb-8'>
          {process.env.NODE_ENV === 'development'
            ? error.message
            : 'An unexpected error occurred. Our team has been notified.'}
        </p>
        <div className='flex items-center justify-center gap-3'>
          <Button onClick={reset} variant='primary'>
            <RefreshCw className='h-4 w-4' aria-hidden='true' />
            Try again
          </Button>
          <Link href='/'>
            <Button variant='outline'>
              <Home className='h-4 w-4' aria-hidden='true' />
              Go home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
