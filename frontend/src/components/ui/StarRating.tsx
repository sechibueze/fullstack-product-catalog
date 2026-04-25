import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  className?: string;
}

export function StarRating({
  rating,
  max = 5,
  size = 'md',
  showValue = false,
  className,
}: StarRatingProps) {
  const sizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  return (
    <div
      className={cn('flex items-center gap-1', className)}
      role='img'
      aria-label={`Rating: ${rating} out of ${max} stars`}
    >
      {Array.from({ length: max }, (_, i) => (
        <Star
          key={i}
          className={cn(
            sizes[size],
            i < Math.round(rating)
              ? 'fill-accent text-accent'
              : 'fill-none text-gray-300',
          )}
          aria-hidden='true'
        />
      ))}
      {showValue && (
        <span className='text-sm text-text-secondary ml-1'>
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
