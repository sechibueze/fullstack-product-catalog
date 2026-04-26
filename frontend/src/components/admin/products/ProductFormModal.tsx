'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Loader2 } from 'lucide-react';
import { productSchema, ProductFormData } from '@/lib/validations/product';
import { RawProduct, RawCategory } from '@/types/api';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProductFormData) => Promise<void>;
  categories: RawCategory[];
  product?: RawProduct | null;
  isLoading?: boolean;
}

export function ProductFormModal({
  isOpen,
  onClose,
  onSubmit,
  categories,
  product,
  isLoading = false,
}: ProductFormModalProps) {
  const isEditing = !!product;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      category_id: '',
      name: '',
      description: '',
      price: 0,
      stock_qty: 0,
      is_published: false,
    },
  });

  // Pre-populate form when editing
  useEffect(() => {
    if (product) {
      reset({
        category_id: product.category_id,
        name: product.name,
        description: product.description ?? '',
        price: parseFloat(product.price),
        stock_qty: product.stock_qty,
        is_published: product.is_published,
        slug: product.slug,
      });
    } else {
      reset({
        category_id: '',
        name: '',
        description: '',
        price: 0,
        stock_qty: 0,
        is_published: false,
      });
    }
  }, [product, reset]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const inputClass = (hasError: boolean) =>
    cn(
      'w-full px-3 py-2 rounded-md border text-sm',
      'bg-surface text-text-primary placeholder:text-text-tertiary',
      'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
      'transition-colors duration-fast',
      hasError ? 'border-danger' : 'border-border',
    );

  return (
    <div
      className='fixed inset-0 z-[var(--z-modal)] flex items-center justify-center p-4'
      role='dialog'
      aria-modal='true'
      aria-labelledby='product-modal-title'
    >
      {/* Backdrop */}
      <div
        className='absolute inset-0 bg-black/50 backdrop-blur-sm'
        onClick={onClose}
        aria-hidden='true'
      />

      {/* Modal */}
      <div className='relative w-full max-w-lg bg-surface rounded-2xl border border-border shadow-xl max-h-[90vh] overflow-y-auto'>
        {/* Header */}
        <div className='flex items-center justify-between p-6 border-b border-border sticky top-0 bg-surface'>
          <h2
            id='product-modal-title'
            className='text-lg font-semibold text-text-primary'
          >
            {isEditing ? 'Edit Product' : 'Create Product'}
          </h2>
          <button
            onClick={onClose}
            aria-label='Close modal'
            className='p-2 rounded-md text-text-tertiary hover:text-text-primary hover:bg-bg-secondary transition-colors duration-fast'
          >
            <X className='h-4 w-4' aria-hidden='true' />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className='p-6 space-y-4'
        >
          {/* Category */}
          <div>
            <label
              htmlFor='category_id'
              className='block text-sm font-medium text-text-primary mb-1'
            >
              Category{' '}
              <span className='text-danger' aria-hidden='true'>
                *
              </span>
            </label>
            <select
              id='category_id'
              {...register('category_id')}
              aria-invalid={!!errors.category_id}
              className={inputClass(!!errors.category_id)}
            >
              <option value=''>Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.category_id && (
              <p role='alert' className='text-xs text-danger mt-1'>
                {errors.category_id.message}
              </p>
            )}
          </div>

          {/* Name */}
          <div>
            <label
              htmlFor='name'
              className='block text-sm font-medium text-text-primary mb-1'
            >
              Name{' '}
              <span className='text-danger' aria-hidden='true'>
                *
              </span>
            </label>
            <input
              id='name'
              type='text'
              {...register('name')}
              aria-invalid={!!errors.name}
              placeholder='Product name'
              className={inputClass(!!errors.name)}
            />
            {errors.name && (
              <p role='alert' className='text-xs text-danger mt-1'>
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor='description'
              className='block text-sm font-medium text-text-primary mb-1'
            >
              Description
            </label>
            <textarea
              id='description'
              rows={3}
              {...register('description')}
              placeholder='Product description'
              className={cn(inputClass(!!errors.description), 'resize-none')}
            />
          </div>

          {/* Price and Stock */}
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label
                htmlFor='price'
                className='block text-sm font-medium text-text-primary mb-1'
              >
                Price{' '}
                <span className='text-danger' aria-hidden='true'>
                  *
                </span>
              </label>
              <input
                id='price'
                type='number'
                step='0.01'
                min='0'
                {...register('price')}
                aria-invalid={!!errors.price}
                placeholder='0.00'
                className={inputClass(!!errors.price)}
              />
              {errors.price && (
                <p role='alert' className='text-xs text-danger mt-1'>
                  {errors.price.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor='stock_qty'
                className='block text-sm font-medium text-text-primary mb-1'
              >
                Stock{' '}
                <span className='text-danger' aria-hidden='true'>
                  *
                </span>
              </label>
              <input
                id='stock_qty'
                type='number'
                min='0'
                {...register('stock_qty')}
                aria-invalid={!!errors.stock_qty}
                placeholder='0'
                className={inputClass(!!errors.stock_qty)}
              />
              {errors.stock_qty && (
                <p role='alert' className='text-xs text-danger mt-1'>
                  {errors.stock_qty.message}
                </p>
              )}
            </div>
          </div>

          {/* Published toggle */}
          <div className='flex items-center justify-between p-3 rounded-md border border-border bg-bg-secondary'>
            <div>
              <p className='text-sm font-medium text-text-primary'>Published</p>
              <p className='text-xs text-text-tertiary'>
                Published products are visible to customers
              </p>
            </div>
            <button
              type='button'
              role='switch'
              aria-checked={watch('is_published')}
              onClick={() =>
                setValue('is_published', !watch('is_published'), {
                  shouldValidate: true,
                })
              }
              className={cn(
                'relative inline-flex h-6 w-11 items-center rounded-full',
                'transition-colors duration-normal',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                watch('is_published') ? 'bg-primary' : 'bg-border-strong',
              )}
            >
              <span
                className={cn(
                  'inline-block h-4 w-4 rounded-full bg-white shadow-sm',
                  'transition-transform duration-normal',
                  watch('is_published') ? 'translate-x-6' : 'translate-x-1',
                )}
              />
            </button>
          </div>

          {/* Actions */}
          <div className='flex items-center justify-end gap-3 pt-2 border-t border-border'>
            <Button type='button' variant='ghost' size='sm' onClick={onClose}>
              Cancel
            </Button>
            <Button
              type='submit'
              variant='primary'
              size='sm'
              loading={isSubmitting || isLoading}
            >
              {isEditing ? 'Save Changes' : 'Create Product'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
