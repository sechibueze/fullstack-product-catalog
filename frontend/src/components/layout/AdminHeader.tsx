'use client';
import { useAuth } from '@/providers/AuthProvider';
import { useTheme } from '@/providers/ThemeProvider';
import { Sun, Moon, LogOut, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export function AdminHeader() {
  const { isDark, toggleTheme } = useTheme();
  const router = useRouter();
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      router.push('/admin/login');
    } catch {
      localStorage.removeItem('auth_token');
      router.push('/admin/login');
    }
  };

  return (
    <header
      className={cn(
        'sticky top-0 z-[var(--z-sticky)]',
        'h-16 flex items-center justify-between',
        'px-4 md:px-6 lg:px-8',
        'bg-surface border-b border-border',
        'shadow-sm',
      )}
    >
      <h1 className='text-sm font-semibold text-text-secondary'>
        {user ? `Welcome, ${user.name}` : 'Admin Dashboard'}
      </h1>

      <div className='flex items-center gap-2'>
        {/* User info */}
        {user && (
          <div className='hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-md bg-bg-secondary'>
            <User
              className='h-3.5 w-3.5 text-text-tertiary'
              aria-hidden='true'
            />
            <span className='text-xs text-text-secondary'>{user.email}</span>
          </div>
        )}

        <div className='flex items-center gap-2'>
          {/* Dark mode toggle */}
          <button
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className={cn(
              'p-2 rounded-md',
              'text-text-secondary hover:text-primary',
              'hover:bg-bg-secondary',
              'transition-colors duration-fast',
              'focus-visible:outline-none focus-visible:ring-2',
              'focus-visible:ring-primary',
            )}
          >
            {isDark ? (
              <Sun className='h-4 w-4' aria-hidden='true' />
            ) : (
              <Moon className='h-4 w-4' aria-hidden='true' />
            )}
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            aria-label='Logout'
            className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-md',
              'text-sm text-text-secondary hover:text-danger',
              'hover:bg-danger-light',
              'transition-colors duration-fast',
              'focus-visible:outline-none focus-visible:ring-2',
              'focus-visible:ring-danger',
            )}
          >
            <LogOut className='h-4 w-4' aria-hidden='true' />
            <span className='hidden sm:inline'>Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
