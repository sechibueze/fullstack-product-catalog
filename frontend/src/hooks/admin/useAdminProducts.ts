import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  adminProductsService,
  CreateProductPayload,
  UpdateProductPayload,
} from '@/services/admin/products';
import { adminCategoriesService } from '@/services/admin/categories';
import { RawProduct, RawPaginatedResponse } from '@/types/api';

export const PRODUCTS_KEY = ['admin', 'products'] as const;
export const CATEGORIES_KEY = ['admin', 'categories'] as const;

// Queries

export function useAdminProducts(params: Record<string, string> = {}) {
  return useQuery({
    queryKey: [...PRODUCTS_KEY, params],
    queryFn: () => adminProductsService.list(params),
  });
}

export function useAdminCategories() {
  return useQuery({
    queryKey: CATEGORIES_KEY,
    queryFn: adminCategoriesService.list,
    staleTime: 5 * 60 * 1000,
  });
}

// Cache helpers

function getAllProductCacheEntries(
  queryClient: ReturnType<typeof useQueryClient>,
): Array<{ key: readonly unknown[]; data: RawPaginatedResponse<RawProduct> }> {
  return queryClient
    .getQueriesData<RawPaginatedResponse<RawProduct>>({
      queryKey: PRODUCTS_KEY,
    })
    .filter(
      (
        entry,
      ): entry is [readonly unknown[], RawPaginatedResponse<RawProduct>] =>
        entry[1] !== undefined,
    )
    .map(([key, data]) => ({ key, data }));
}

function updateProductInAllCaches(
  queryClient: ReturnType<typeof useQueryClient>,
  id: string,
  updater: (product: RawProduct) => RawProduct,
) {
  const entries = getAllProductCacheEntries(queryClient);
  entries.forEach(({ key, data }) => {
    queryClient.setQueryData<RawPaginatedResponse<RawProduct>>(key, {
      ...data,
      data: data.data.map((p) => (p.id === id ? updater(p) : p)),
    });
  });
}

function removeProductFromAllCaches(
  queryClient: ReturnType<typeof useQueryClient>,
  id: string,
) {
  const entries = getAllProductCacheEntries(queryClient);
  entries.forEach(({ key, data }) => {
    queryClient.setQueryData<RawPaginatedResponse<RawProduct>>(key, {
      ...data,
      data: data.data.filter((p) => p.id !== id),
    });
  });
}

function snapshotAllProductCaches(
  queryClient: ReturnType<typeof useQueryClient>,
): Array<{ key: readonly unknown[]; data: RawPaginatedResponse<RawProduct> }> {
  return getAllProductCacheEntries(queryClient);
}

function restoreProductCaches(
  queryClient: ReturnType<typeof useQueryClient>,
  snapshot: Array<{
    key: readonly unknown[];
    data: RawPaginatedResponse<RawProduct>;
  }>,
) {
  snapshot.forEach(({ key, data }) => {
    queryClient.setQueryData(key, data);
  });
}

// Mutations

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateProductPayload) =>
      adminProductsService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_KEY });
      toast.success('Product created successfully.');
    },
    onError: () => {
      toast.error('Failed to create product.');
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateProductPayload;
    }) => adminProductsService.update(id, payload),

    onMutate: async ({ id, payload }) => {
      await queryClient.cancelQueries({ queryKey: PRODUCTS_KEY });
      const snapshot = snapshotAllProductCaches(queryClient);

      updateProductInAllCaches(queryClient, id, (product) => ({
        ...product,
        name: payload.name ?? product.name,
        description: payload.description ?? product.description,
        price:
          payload.price !== undefined ? String(payload.price) : product.price,
        stock_qty: payload.stock_qty ?? product.stock_qty,
        is_published: payload.is_published ?? product.is_published,
        category_id: payload.category_id ?? product.category_id,
        slug: payload.slug ?? product.slug,
      }));

      return { snapshot };
    },

    onError: (_err, _vars, context) => {
      if (context?.snapshot) {
        restoreProductCaches(queryClient, context.snapshot);
      }
      toast.error('Failed to update product.');
    },

    onSuccess: (_response, { id, payload }) => {
      // Write real server data into cache
      updateProductInAllCaches(queryClient, id, (product) => ({
        ...product,
        name: payload.name ?? product.name,
        description: payload.description ?? product.description,
        price:
          payload.price !== undefined ? String(payload.price) : product.price,
        stock_qty: payload.stock_qty ?? product.stock_qty,
        is_published: payload.is_published ?? product.is_published,
        category_id: payload.category_id ?? product.category_id,
        slug: payload.slug ?? product.slug,
      }));
      toast.success('Product updated successfully.');
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_KEY });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminProductsService.delete(id),

    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: PRODUCTS_KEY });
      const snapshot = snapshotAllProductCaches(queryClient);
      removeProductFromAllCaches(queryClient, id);
      return { snapshot };
    },

    onError: (_err, _id, context) => {
      if (context?.snapshot) {
        restoreProductCaches(queryClient, context.snapshot);
      }
      toast.error('Failed to delete product.');
    },

    onSuccess: () => {
      toast.success('Product deleted successfully.');
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_KEY });
    },
  });
}

export function useTogglePublished() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isPublished }: { id: string; isPublished: boolean }) =>
      adminProductsService.togglePublished(id, isPublished),

    onMutate: async ({ id, isPublished }) => {
      await queryClient.cancelQueries({ queryKey: PRODUCTS_KEY });
      const snapshot = snapshotAllProductCaches(queryClient);
      updateProductInAllCaches(queryClient, id, (p) => ({
        ...p,
        is_published: isPublished,
      }));
      return { snapshot };
    },

    onError: (_err, _vars, context) => {
      if (context?.snapshot) {
        restoreProductCaches(queryClient, context.snapshot);
      }
      toast.error('Failed to update product status.');
    },

    onSuccess: (response, { id }) => {
      updateProductInAllCaches(queryClient, id, () => response.data);
      toast.success('Product status updated.');
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_KEY });
    },
  });
}
