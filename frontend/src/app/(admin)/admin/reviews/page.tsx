'use client';
import { useState } from 'react';
import {
  CheckCircle,
  XCircle,
  Trash2,
  Loader2,
  MessageSquare,
  Star,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { ConfirmModal } from '@/components/admin/ConfirmModal';
import { Pagination } from '@/components/ui/Pagination';
import {
  useAdminReviews,
  useApproveReview,
  useRejectReview,
  useDeleteReview,
} from '@/hooks/admin/useAdminReviews';
import { RawReview } from '@/types/api';
import { formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';

type FilterStatus = 'all' | 'approved' | 'unapproved';

const STATUS_FILTERS: { label: string; value: FilterStatus }[] = [
  { label: 'All Reviews', value: 'all' },
  { label: 'Approved', value: 'approved' },
  { label: 'Unapproved', value: 'unapproved' },
];

export default function AdminReviewsPage() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [selectedReview, setSelectedReview] = useState<RawReview | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const params: Record<string, string> = {
    page: String(page),
    per_page: '15',
  };

  if (statusFilter === 'approved') params.is_approved = 'true';
  if (statusFilter === 'unapproved') params.is_approved = 'false';

  const { data, isLoading, isError } = useAdminReviews(params);
  const approveReview = useApproveReview();
  const rejectReview = useRejectReview();
  const deleteReview = useDeleteReview();

  const reviews = data?.data ?? [];
  const meta = data?.meta;

  const handleApprove = (review: RawReview) => {
    approveReview.mutate(review.id);
  };

  const handleReject = (review: RawReview) => {
    rejectReview.mutate(review.id);
  };

  const handleDeleteClick = (review: RawReview) => {
    setSelectedReview(review);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedReview) return;
    deleteReview.mutate(selectedReview.id, {
      onSettled: () => {
        setIsDeleteOpen(false);
        setSelectedReview(null);
      },
    });
  };

  const handleFilterChange = (filter: FilterStatus) => {
    setStatusFilter(filter);
    setPage(1);
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div>
        <h1 className='text-2xl font-bold text-text-primary'>Reviews</h1>
        <p className='text-sm text-text-secondary mt-0.5'>
          Moderate customer reviews
        </p>
      </div>

      {/* Status filter tabs */}
      <div
        role='tablist'
        aria-label='Filter reviews by status'
        className='flex gap-1 p-1 rounded-lg bg-bg-secondary border border-border w-fit'
      >
        {STATUS_FILTERS.map((filter) => (
          <button
            key={filter.value}
            role='tab'
            aria-selected={statusFilter === filter.value}
            onClick={() => handleFilterChange(filter.value)}
            className={cn(
              'px-4 py-1.5 rounded-md text-sm font-medium',
              'transition-colors duration-fast',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
              statusFilter === filter.value
                ? 'bg-surface text-text-primary shadow-sm'
                : 'text-text-secondary hover:text-text-primary',
            )}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className='rounded-xl border border-border bg-surface overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full min-w-[750px] text-sm'>
            <thead>
              <tr className='border-b border-border bg-bg-secondary'>
                <th
                  scope='col'
                  className='sticky left-0 bg-bg-secondary px-4 py-3 text-left font-semibold text-text-secondary whitespace-nowrap'
                >
                  Reviewer
                </th>
                <th
                  scope='col'
                  className='px-4 py-3 text-left font-semibold text-text-secondary whitespace-nowrap'
                >
                  Product
                </th>
                <th
                  scope='col'
                  className='px-4 py-3 text-left font-semibold text-text-secondary whitespace-nowrap'
                >
                  Rating
                </th>
                <th
                  scope='col'
                  className='px-4 py-3 text-left font-semibold text-text-secondary whitespace-nowrap'
                >
                  Review
                </th>
                <th
                  scope='col'
                  className='px-4 py-3 text-left font-semibold text-text-secondary whitespace-nowrap'
                >
                  Status
                </th>
                <th
                  scope='col'
                  className='px-4 py-3 text-left font-semibold text-text-secondary whitespace-nowrap'
                >
                  Date
                </th>
                <th
                  scope='col'
                  className='px-4 py-3 text-right font-semibold text-text-secondary whitespace-nowrap'
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-border'>
              {isLoading && (
                <tr>
                  <td colSpan={7} className='px-4 py-12 text-center'>
                    <Loader2
                      className='h-6 w-6 animate-spin text-primary mx-auto'
                      aria-label='Loading reviews'
                    />
                  </td>
                </tr>
              )}

              {isError && (
                <tr>
                  <td
                    colSpan={7}
                    className='px-4 py-12 text-center text-danger text-sm'
                  >
                    Failed to load reviews. Please refresh.
                  </td>
                </tr>
              )}

              {!isLoading && !isError && !reviews.length && (
                <tr>
                  <td colSpan={7} className='px-4 py-12 text-center'>
                    <MessageSquare
                      className='h-10 w-10 text-text-tertiary mx-auto mb-2'
                      aria-hidden='true'
                    />
                    <p className='text-text-secondary text-sm'>
                      No reviews found.
                    </p>
                  </td>
                </tr>
              )}

              {reviews.map((review) => (
                <tr
                  key={review.id}
                  className='hover:bg-bg-secondary transition-colors duration-fast'
                >
                  {/* Reviewer — sticky first column */}
                  <td className='sticky left-0 bg-surface px-4 py-3 whitespace-nowrap'>
                    <p className='font-medium text-text-primary'>
                      {review.reviewer_name}
                    </p>
                    <p className='text-xs text-text-tertiary'>{review.email}</p>
                  </td>

                  {/* Product */}
                  <td className='px-4 py-3 text-text-secondary whitespace-nowrap max-w-[150px] truncate'>
                    {review.product?.name ?? '—'}
                  </td>

                  {/* Rating */}
                  <td className='px-4 py-3 whitespace-nowrap'>
                    <div className='flex items-center gap-1'>
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            'h-3.5 w-3.5',
                            i < review.rating
                              ? 'fill-accent text-accent'
                              : 'fill-none text-gray-300',
                          )}
                          aria-hidden='true'
                        />
                      ))}
                      <span className='text-xs text-text-secondary ml-1'>
                        {review.rating}/5
                      </span>
                    </div>
                  </td>

                  {/* Review body */}
                  <td className='px-4 py-3 text-text-secondary max-w-[250px]'>
                    <p className='truncate'>{review.body}</p>
                  </td>

                  {/* Status */}
                  <td className='px-4 py-3 whitespace-nowrap'>
                    <Badge variant={review.is_approved ? 'success' : 'warning'}>
                      {review.is_approved ? 'Approved' : 'Pending'}
                    </Badge>
                  </td>

                  {/* Date */}
                  <td className='px-4 py-3 text-text-tertiary whitespace-nowrap text-xs'>
                    {formatDate(review.created_at)}
                  </td>

                  {/* Actions */}
                  <td className='px-4 py-3 whitespace-nowrap'>
                    <div className='flex items-center justify-end gap-1'>
                      {/* Approve */}
                      {!review.is_approved && (
                        <button
                          onClick={() => handleApprove(review)}
                          disabled={approveReview.isPending}
                          aria-label={`Approve review by ${review.reviewer_name}`}
                          title='Approve'
                          className='p-1.5 rounded-md text-text-secondary hover:bg-success-light hover:text-success transition-colors duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-success disabled:opacity-50'
                        >
                          <CheckCircle className='h-4 w-4' aria-hidden='true' />
                        </button>
                      )}

                      {/* Reject */}
                      {review.is_approved && (
                        <button
                          onClick={() => handleReject(review)}
                          disabled={rejectReview.isPending}
                          aria-label={`Reject review by ${review.reviewer_name}`}
                          title='Reject'
                          className='p-1.5 rounded-md text-text-secondary hover:bg-warning-light hover:text-warning transition-colors duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warning disabled:opacity-50'
                        >
                          <XCircle className='h-4 w-4' aria-hidden='true' />
                        </button>
                      )}

                      {/* Delete */}
                      <button
                        onClick={() => handleDeleteClick(review)}
                        aria-label={`Delete review by ${review.reviewer_name}`}
                        title='Delete'
                        className='p-1.5 rounded-md text-text-secondary hover:bg-danger-light hover:text-danger transition-colors duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger'
                      >
                        <Trash2 className='h-4 w-4' aria-hidden='true' />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {meta && meta.last_page > 1 && (
          <div className='px-4 py-4 border-t border-border'>
            <Pagination
              currentPage={meta.current_page}
              lastPage={meta.last_page}
              baseUrl='/admin/reviews'
              searchParams={
                statusFilter !== 'all'
                  ? {
                      is_approved:
                        statusFilter === 'approved' ? 'true' : 'false',
                    }
                  : {}
              }
            />
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      <ConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setSelectedReview(null);
        }}
        onConfirm={handleDeleteConfirm}
        title='Delete Review'
        message={`Are you sure you want to delete the review by "${selectedReview?.reviewer_name}"? This cannot be undone.`}
        isLoading={deleteReview.isPending}
      />
    </div>
  );
}
