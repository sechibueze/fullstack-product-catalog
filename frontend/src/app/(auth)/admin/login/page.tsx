'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { ShoppingBag, Lock, Mail, Loader2 } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import { getApiError } from '@/lib/api';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login, isAuth, isLoading } = useAuth();
  const router = useRouter();

  // Redirect if already authenticated
  useEffect(() => {
    if (!isLoading && isAuth) {
      router.replace('/admin/products');
    }
  }, [isAuth, isLoading, router]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password);
      toast.success('Welcome back!');
      router.replace('/admin/products');
    } catch (error) {
      const err = getApiError(error);
      toast.error(err.message || 'Invalid credentials.');
    }
  };

  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <Loader2 className='h-8 w-8 animate-spin text-primary' />
      </div>
    );
  }

  return (
    <div className='min-h-screen flex items-center justify-center px-4 bg-bg-secondary'>
      <div className='w-full max-w-md'>
        {/* Logo  */}
        <div className='text-center mb-8'>
          <div className='inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-primary mb-4'>
            <ShoppingBag
              className='h-7 w-7 text-text-inverse'
              aria-hidden='true'
            />
          </div>
          <h1 className='text-2xl font-bold text-text-primary'>Admin Login</h1>
          <p className='text-text-secondary text-sm mt-1'>
            Sign in to manage your product catalog
          </p>
        </div>

        {/*  Form  */}
        <div className='bg-surface rounded-2xl border border-border p-8 shadow-md'>
          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            aria-label='Admin login form'
            className='space-y-5'
          >
            {/* Email */}
            <div>
              <label
                htmlFor='email'
                className='block text-sm font-medium text-text-primary mb-1.5'
              >
                Email address
              </label>
              <div className='relative'>
                <Mail
                  className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-tertiary'
                  aria-hidden='true'
                />
                <input
                  id='email'
                  type='email'
                  autoComplete='email'
                  aria-describedby={errors.email ? 'email-error' : undefined}
                  aria-invalid={!!errors.email}
                  {...register('email')}
                  placeholder='admin@example.com'
                  className={cn(
                    'w-full pl-10 pr-4 py-2.5 rounded-md border text-sm',
                    'bg-surface text-text-primary placeholder:text-text-tertiary',
                    'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
                    'transition-colors duration-fast',
                    errors.email ? 'border-danger' : 'border-border',
                  )}
                />
              </div>
              {errors.email && (
                <p
                  id='email-error'
                  role='alert'
                  className='text-xs text-danger mt-1'
                >
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor='password'
                className='block text-sm font-medium text-text-primary mb-1.5'
              >
                Password
              </label>
              <div className='relative'>
                <Lock
                  className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-tertiary'
                  aria-hidden='true'
                />
                <input
                  id='password'
                  type='password'
                  autoComplete='current-password'
                  aria-describedby={
                    errors.password ? 'password-error' : undefined
                  }
                  aria-invalid={!!errors.password}
                  {...register('password')}
                  placeholder='********'
                  className={cn(
                    'w-full pl-10 pr-4 py-2.5 rounded-md border text-sm',
                    'bg-surface text-text-primary placeholder:text-text-tertiary',
                    'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
                    'transition-colors duration-fast',
                    errors.password ? 'border-danger' : 'border-border',
                  )}
                />
              </div>
              {errors.password && (
                <p
                  id='password-error'
                  role='alert'
                  className='text-xs text-danger mt-1'
                >
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type='submit'
              disabled={isSubmitting}
              aria-busy={isSubmitting}
              className={cn(
                'w-full flex items-center justify-center gap-2',
                'px-4 py-2.5 rounded-md',
                'bg-primary text-text-inverse font-semibold text-sm',
                'hover:bg-primary-hover transition-colors duration-fast',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                'disabled:opacity-50 disabled:cursor-not-allowed',
              )}
            >
              {isSubmitting ? (
                <>
                  <Loader2
                    className='h-4 w-4 animate-spin'
                    aria-hidden='true'
                  />
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          {/* Default credentials hint for dev */}
          {process.env.NODE_ENV === 'development' && (
            <div className='mt-6 p-3 rounded-md bg-info-light border border-info text-xs text-text-secondary'>
              <p className='font-medium text-info mb-1'>
                Development credentials
              </p>
              <p>Email: admin@example.com</p>
              <p>Password: password</p>
            </div>
          )}
        </div>

        {/*  Back to store  */}
        <p className='text-center text-sm text-text-secondary mt-6'>
          <Link
            href='/'
            className='text-primary hover:text-primary-hover transition-colors duration-fast'
          >
            ← Back to store
          </Link>
        </p>
      </div>
    </div>
  );
}
