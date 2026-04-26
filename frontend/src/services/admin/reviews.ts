import { apiClient } from '@/lib/api';
import { RawReview, RawPaginatedResponse } from '@/types/api';

export interface UpdateReviewPayload {
  is_approved?: boolean;
  rating?: number;
  body?: string;
}

export const adminReviewsService = {
  async list(params: Record<string, string> = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await apiClient.get<RawPaginatedResponse<RawReview>>(
      `/reviews${query ? `?${query}` : ''}`,
    );
    return res.data;
  },

  async approve(id: string) {
    const res = await apiClient.patch<{ data: RawReview; message: string }>(
      `/reviews/${id}/approve`,
    );
    return res.data;
  },

  async reject(id: string) {
    const res = await apiClient.patch<{ data: RawReview; message: string }>(
      `/reviews/${id}/reject`,
    );
    return res.data;
  },

  async delete(id: string) {
    const res = await apiClient.delete<{ data: null; message: string }>(
      `/reviews/${id}`,
    );
    return res.data;
  },
};
