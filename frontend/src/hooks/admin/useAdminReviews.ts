import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryKey,
} from '@tanstack/react-query';
import { toast } from 'sonner';
import { adminReviewsService } from '@/services/admin/reviews';
import { RawReview, RawPaginatedResponse } from '@/types/api';

export const REVIEWS_KEY = ['admin', 'reviews'] as const;

function updateReviewInCache(
  queryClient: ReturnType<typeof useQueryClient>,
  id: string,
  updater: (review: RawReview) => RawReview,
) {
  queryClient.setQueriesData<RawPaginatedResponse<RawReview>>(
    { queryKey: REVIEWS_KEY },
    (old) => {
      if (!old) return old;
      return {
        ...old,
        data: old.data.map((r) => (r.id === id ? updater(r) : r)),
      };
    },
  );
}

function removeReviewFromCache(
  queryClient: ReturnType<typeof useQueryClient>,
  id: string,
) {
  queryClient.setQueriesData<RawPaginatedResponse<RawReview>>(
    { queryKey: REVIEWS_KEY },
    (old) => {
      if (!old) return old;
      return {
        ...old,
        data: old.data.filter((r) => r.id !== id),
      };
    },
  );
}

// Queries

export function useAdminReviews(params: Record<string, string> = {}) {
  return useQuery({
    queryKey: [...REVIEWS_KEY, params],
    queryFn: () => adminReviewsService.list(params),
  });
}

// Mutations

export function useApproveReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminReviewsService.approve(id),

    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: REVIEWS_KEY });
      const previousData = queryClient.getQueriesData<
        RawPaginatedResponse<RawReview>
      >({ queryKey: REVIEWS_KEY });
      updateReviewInCache(queryClient, id, (r) => ({
        ...r,
        is_approved: true,
      }));
      return { previousData };
    },

    onError: (_err, _id, context) => {
      context?.previousData.forEach(([key, data]) => {
        queryClient.setQueryData(key as QueryKey, data);
      });
      toast.error('Failed to approve review.');
    },

    onSuccess: (response, id) => {
      updateReviewInCache(queryClient, id, () => response.data);
      toast.success('Review approved.');
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: REVIEWS_KEY });
    },
  });
}

export function useRejectReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminReviewsService.reject(id),

    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: REVIEWS_KEY });
      const previousData = queryClient.getQueriesData<
        RawPaginatedResponse<RawReview>
      >({ queryKey: REVIEWS_KEY });
      updateReviewInCache(queryClient, id, (r) => ({
        ...r,
        is_approved: false,
      }));
      return { previousData };
    },

    onError: (_err, _id, context) => {
      context?.previousData.forEach(([key, data]) => {
        queryClient.setQueryData(key as QueryKey, data);
      });
      toast.error('Failed to reject review.');
    },

    onSuccess: (response, id) => {
      updateReviewInCache(queryClient, id, () => response.data);
      toast.success('Review rejected.');
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: REVIEWS_KEY });
    },
  });
}

export function useDeleteReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminReviewsService.delete(id),

    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: REVIEWS_KEY });
      const previousData = queryClient.getQueriesData<
        RawPaginatedResponse<RawReview>
      >({ queryKey: REVIEWS_KEY });
      removeReviewFromCache(queryClient, id);
      return { previousData };
    },

    onError: (_err, _id, context) => {
      context?.previousData.forEach(([key, data]) => {
        queryClient.setQueryData(key as QueryKey, data);
      });
      toast.error('Failed to delete review.');
    },

    onSuccess: () => {
      toast.success('Review deleted.');
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: REVIEWS_KEY });
    },
  });
}
