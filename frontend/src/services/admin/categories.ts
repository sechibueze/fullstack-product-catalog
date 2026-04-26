import { apiClient } from '@/lib/api';
import { RawCategory, RawPaginatedResponse } from '@/types/api';

export const adminCategoriesService = {
  async list() {
    const res = await apiClient.get<RawPaginatedResponse<RawCategory>>(
      '/categories?per_page=100',
    );
    return res.data;
  },
};
