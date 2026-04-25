'use client';
import { useEffect } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AdminError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('[AdminError]', error);
  }, [error]);

  return (
    <div
      role='alert'
      className='flex flex-col items-center justify-center min-h-[60vh] text-center px-4'
    >
      <AlertTriangle
        className='h-12 w-12 text-warning mb-4'
        aria-hidden='true'
      />
      <h2 className='text-xl font-bold text-text-primary mb-2'>
        Admin panel error
      </h2>
      <p className='text-text-secondary text-sm mb-6 max-w-sm'>
        {process.env.NODE_ENV === 'development'
          ? error.message
          : 'Something went wrong. Please try again.'}
      </p>
      <Button onClick={reset} variant='primary' size='sm'>
        <RefreshCw className='h-4 w-4' aria-hidden='true' />
        Try again
      </Button>
    </div>
  );
}
