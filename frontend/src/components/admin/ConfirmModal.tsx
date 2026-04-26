'use client';
import { useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  isLoading?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  isLoading = false,
}: ConfirmModalProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className='fixed inset-0 z-[var(--z-modal)] flex items-center justify-center p-4'
      role='dialog'
      aria-modal='true'
      aria-labelledby='confirm-modal-title'
    >
      {/* Backdrop */}
      <div
        className='absolute inset-0 bg-black/50 backdrop-blur-sm'
        onClick={onClose}
        aria-hidden='true'
      />

      {/* Modal */}
      <div className='relative w-full max-w-sm bg-surface rounded-2xl border border-border shadow-xl p-6'>
        <button
          onClick={onClose}
          aria-label='Close'
          className='absolute top-4 right-4 p-1.5 rounded-md text-text-tertiary hover:text-text-primary hover:bg-bg-secondary transition-colors'
        >
          <X className='h-4 w-4' aria-hidden='true' />
        </button>

        <div className='flex flex-col items-center text-center gap-4'>
          <div className='h-12 w-12 rounded-full bg-danger-light flex items-center justify-center'>
            <AlertTriangle className='h-6 w-6 text-danger' aria-hidden='true' />
          </div>
          <div>
            <h2
              id='confirm-modal-title'
              className='text-lg font-semibold text-text-primary mb-1'
            >
              {title}
            </h2>
            <p className='text-sm text-text-secondary'>{message}</p>
          </div>
          <div className='flex items-center gap-3 w-full'>
            <Button
              variant='outline'
              size='sm'
              onClick={onClose}
              className='flex-1'
            >
              Cancel
            </Button>
            <Button
              variant='danger'
              size='sm'
              onClick={onConfirm}
              loading={isLoading}
              className='flex-1'
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
