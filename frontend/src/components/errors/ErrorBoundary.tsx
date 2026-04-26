'use client';
import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Errors here can be sent to a remote logging service like Sentry
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div
          role='alert'
          className='flex flex-col items-center justify-center min-h-[400px] px-4 text-center'
        >
          <AlertTriangle
            className='h-12 w-12 text-warning mb-4'
            aria-hidden='true'
          />
          <h2 className='text-xl font-semibold text-text-primary mb-2'>
            Something went wrong
          </h2>
          <p className='text-text-secondary text-sm mb-6 max-w-md'>
            {process.env.NODE_ENV === 'development'
              ? this.state.error?.message
              : 'An unexpected error occurred. Please try again.'}
          </p>
          <Button onClick={this.handleReset} variant='outline' size='sm'>
            <RefreshCw className='h-4 w-4' aria-hidden='true' />
            Try again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
