import { apiClient } from '@/lib/api';
import { RawProduct, RawPaginatedResponse } from '@/types/api';

export interface CreateProductPayload {
  category_id: string;
  name: string;
  description?: string;
  price: number;
  stock_qty: number;
  is_published: boolean;
  slug?: string;
}

export type UpdateProductPayload = Partial<CreateProductPayload>;

export const adminProductsService = {
  async list(params: Record<string, string> = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await apiClient.get<RawPaginatedResponse<RawProduct>>(
      `/products${query ? `?${query}` : ''}`,
    );
    return res.data;
  },

  async create(payload: CreateProductPayload) {
    const res = await apiClient.post<{ data: RawProduct; message: string }>(
      '/products',
      payload,
    );
    return res.data;
  },

  async update(id: string, payload: UpdateProductPayload) {
    const res = await apiClient.patch<{ data: RawProduct; message: string }>(
      `/products/${id}`,
      payload,
    );
    return res.data;
  },

  async delete(id: string) {
    const res = await apiClient.delete<{ data: null; message: string }>(
      `/products/${id}`,
    );
    return res.data;
  },

  async togglePublished(id: string, isPublished: boolean) {
    const res = await apiClient.patch<{ data: RawProduct; message: string }>(
      `/products/${id}`,
      { is_published: isPublished },
    );
    return res.data;
  },
};
