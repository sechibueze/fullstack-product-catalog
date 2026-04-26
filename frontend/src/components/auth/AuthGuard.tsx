'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import { Loader2 } from 'lucide-react';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuth, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuth) {
      router.replace('/admin/login');
    }
  }, [isAuth, isLoading, router]);

  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='flex flex-col items-center gap-3'>
          <Loader2
            className='h-8 w-8 animate-spin text-primary'
            aria-hidden='true'
          />
          <p className='text-sm text-text-secondary'>Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuth) return null;

  return <>{children}</>;
}
