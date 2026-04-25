'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { toast } from 'sonner';
import { Star } from 'lucide-react';
import { apiClient, getApiError } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

// Mirror backend validation rules
const reviewSchema = z.object({
  reviewer_name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name cannot exceed 100 characters'),
  email: z.string().email('Please provide a valid email address').max(254),
  rating: z.number().min(1, 'Please select a rating').max(5),
  body: z
    .string()
    .min(10, 'Review must be at least 10 characters')
    .max(2000, 'Review cannot exceed 2000 characters'),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

interface ReviewFormProps {
  productSlug: string;
}

export function ReviewForm({ productSlug }: ReviewFormProps) {
  const [hoveredStar, setHoveredStar] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 0 },
  });

  const currentRating = watch('rating');

  const onSubmit = async (data: ReviewFormData) => {
    try {
      await apiClient.post(`/products/${productSlug}/reviews`, data);
      toast.success('Review submitted! It will appear after approval.');
      reset();
      setSubmitted(true);
    } catch (error) {
      const err = getApiError(error);
      toast.error(err.message || 'Failed to submit review.');
    }
  };

  if (submitted) {
    return (
      <div className='p-6 rounded-xl border border-success-light bg-success-light text-center'>
        <p className='text-success font-semibold mb-1'>
          Thank you for your review!
        </p>
        <p className='text-sm text-text-secondary'>
          Your review is pending approval and will appear shortly.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className='mt-4 text-sm text-primary hover:text-primary-hover underline'
        >
          Write another review
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      aria-label='Submit a review'
      className='space-y-4 p-5 rounded-xl border border-border bg-surface'
    >
      {/* Star rating picker */}
      <fieldset>
        <legend className='text-sm font-medium text-text-primary mb-2'>
          Your Rating{' '}
          <span className='text-danger' aria-hidden='true'>
            *
          </span>
        </legend>
        <div className='flex gap-1' role='radiogroup' aria-label='Rating'>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type='button'
              onClick={() => setValue('rating', star, { shouldValidate: true })}
              onMouseEnter={() => setHoveredStar(star)}
              onMouseLeave={() => setHoveredStar(0)}
              aria-label={`Rate ${star} out of 5 stars`}
              aria-pressed={currentRating === star}
              className='p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded'
            >
              <Star
                className={cn(
                  'h-6 w-6 transition-colors duration-fast',
                  (hoveredStar || currentRating) >= star
                    ? 'fill-accent text-accent'
                    : 'fill-none text-gray-300',
                )}
                aria-hidden='true'
              />
            </button>
          ))}
        </div>
        {errors.rating && (
          <p role='alert' className='text-xs text-danger mt-1'>
            {errors.rating.message}
          </p>
        )}
      </fieldset>

      {/* Name */}
      <div>
        <label
          htmlFor='reviewer_name'
          className='block text-sm font-medium text-text-primary mb-1'
        >
          Your Name{' '}
          <span className='text-danger' aria-hidden='true'>
            *
          </span>
        </label>
        <input
          id='reviewer_name'
          type='text'
          autoComplete='name'
          aria-describedby={errors.reviewer_name ? 'name-error' : undefined}
          aria-invalid={!!errors.reviewer_name}
          {...register('reviewer_name')}
          className={cn(
            'w-full px-3 py-2 rounded-md border text-sm',
            'bg-surface text-text-primary placeholder:text-text-tertiary',
            'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
            'transition-colors duration-fast',
            errors.reviewer_name ? 'border-danger' : 'border-border',
          )}
          placeholder='John Doe'
        />
        {errors.reviewer_name && (
          <p id='name-error' role='alert' className='text-xs text-danger mt-1'>
            {errors.reviewer_name.message}
          </p>
        )}
      </div>

      {/* Email */}
      <div>
        <label
          htmlFor='email'
          className='block text-sm font-medium text-text-primary mb-1'
        >
          Email{' '}
          <span className='text-danger' aria-hidden='true'>
            *
          </span>
        </label>
        <input
          id='email'
          type='email'
          autoComplete='email'
          aria-describedby={errors.email ? 'email-error' : undefined}
          aria-invalid={!!errors.email}
          {...register('email')}
          className={cn(
            'w-full px-3 py-2 rounded-md border text-sm',
            'bg-surface text-text-primary placeholder:text-text-tertiary',
            'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
            'transition-colors duration-fast',
            errors.email ? 'border-danger' : 'border-border',
          )}
          placeholder='john@example.com'
        />
        {errors.email && (
          <p id='email-error' role='alert' className='text-xs text-danger mt-1'>
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Review body */}
      <div>
        <label
          htmlFor='body'
          className='block text-sm font-medium text-text-primary mb-1'
        >
          Review{' '}
          <span className='text-danger' aria-hidden='true'>
            *
          </span>
        </label>
        <textarea
          id='body'
          rows={4}
          aria-describedby={errors.body ? 'body-error' : undefined}
          aria-invalid={!!errors.body}
          {...register('body')}
          className={cn(
            'w-full px-3 py-2 rounded-md border text-sm',
            'bg-surface text-text-primary placeholder:text-text-tertiary',
            'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
            'transition-colors duration-fast resize-none',
            errors.body ? 'border-danger' : 'border-border',
          )}
          placeholder='Share your experience with this product...'
        />
        {errors.body && (
          <p id='body-error' role='alert' className='text-xs text-danger mt-1'>
            {errors.body.message}
          </p>
        )}
      </div>

      {/* Submit */}
      <Button
        type='submit'
        variant='primary'
        size='md'
        loading={isSubmitting}
        className='w-full'
      >
        Submit Review
      </Button>

      <p className='text-xs text-text-tertiary text-center'>
        Reviews are moderated and appear after approval.
      </p>
    </form>
  );
}
