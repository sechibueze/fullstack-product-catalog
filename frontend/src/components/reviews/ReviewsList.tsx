import { ReviewWithProduct } from '@/db/schema';
import { StarRating } from '@/components/ui/StarRating';
import { formatDate } from '@/lib/utils';
import { MessageSquare, UserCircle } from 'lucide-react';

interface ReviewsListProps {
  reviews: ReviewWithProduct[];
}

export function ReviewsList({ reviews }: ReviewsListProps) {
  if (!reviews.length) {
    return (
      <div className='flex flex-col items-center justify-center py-12 text-center'>
        <MessageSquare
          className='h-12 w-12 text-text-tertiary mb-3'
          aria-hidden='true'
        />
        <p className='text-text-secondary font-medium'>No reviews yet</p>
        <p className='text-text-tertiary text-sm mt-1'>
          Be the first to review this product.
        </p>
      </div>
    );
  }

  return (
    <ol role='list' aria-label='Customer reviews' className='space-y-4'>
      {reviews.map((review) => (
        <li
          key={review.id}
          className='p-5 rounded-xl border border-border bg-surface'
        >
          {/* Header */}
          <div className='flex items-start justify-between gap-4 mb-3'>
            <div className='flex items-center gap-3'>
              <div
                className='h-9 w-9 rounded-full bg-primary-light flex items-center justify-center shrink-0'
                aria-hidden='true'
              >
                <UserCircle className='h-5 w-5 text-primary' />
              </div>
              <div>
                <p className='text-sm font-semibold text-text-primary'>
                  {review.reviewerName}
                </p>
                <time
                  dateTime={review.createdAt.toString()}
                  className='text-xs text-text-tertiary'
                >
                  {formatDate(review.createdAt.toString())}
                </time>
              </div>
            </div>
            <StarRating rating={review.rating} size='sm' />
          </div>

          {/* Body */}
          <p className='text-sm text-text-secondary leading-relaxed'>
            {review.body}
          </p>
        </li>
      ))}
    </ol>
  );
}
