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

//  Helpers

// Updates a single product in all cached product queries
function updateProductInCache(
  queryClient: ReturnType<typeof useQueryClient>,
  id: string,
  updater: (product: RawProduct) => RawProduct,
) {
  // Get all cached queries that start with PRODUCTS_KEY
  queryClient.setQueriesData<RawPaginatedResponse<RawProduct>>(
    { queryKey: PRODUCTS_KEY },
    (old) => {
      if (!old) return old;
      return {
        ...old,
        data: old.data.map((p: RawProduct) => (p.id === id ? updater(p) : p)),
      };
    },
  );
}

function removeProductFromCache(
  queryClient: ReturnType<typeof useQueryClient>,
  id: string,
) {
  queryClient.setQueriesData<RawPaginatedResponse<RawProduct>>(
    { queryKey: PRODUCTS_KEY },
    (old) => {
      if (!old) return old;
      return {
        ...old,
        data: old.data.filter((p: RawProduct) => p.id !== id),
      };
    },
  );
}

//  Mutations

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateProductPayload) =>
      adminProductsService.create(payload),
    onSuccess: () => {
      // Invalidate all product queries so the new product appears
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

    // Optimistic update — update cache immediately before server responds
    onMutate: async ({ id, payload }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: PRODUCTS_KEY });

      // Make a snapshot of previous value for rollback
      const previousData = queryClient.getQueriesData({
        queryKey: PRODUCTS_KEY,
      });

      // Optimistically update the cache
      updateProductInCache(queryClient, id, (product) => ({
        ...product,
        ...payload,
        // Keep existing values for fields not in payload
        name: payload.name ?? product.name,
        description: payload.description ?? product.description,
        price: String(payload.price ?? product.price),
        stock_qty: payload.stock_qty ?? product.stock_qty,
        is_published: payload.is_published ?? product.is_published,
        category_id: payload.category_id ?? product.category_id,
      }));

      return { previousData };
    },

    onError: (_err, _vars, context) => {
      // Rollback to previous state
      if (context?.previousData) {
        context.previousData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast.error('Failed to update product.');
    },

    onSuccess: (response, { id }) => {
      // Update cache with real server data
      updateProductInCache(queryClient, id, () => response.data);
      toast.success('Product updated successfully.');
    },

    onSettled: () => {
      // Always refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: PRODUCTS_KEY });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminProductsService.delete(id),

    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: PRODUCTS_KEY });
      const previousData = queryClient.getQueriesData({
        queryKey: PRODUCTS_KEY,
      });
      removeProductFromCache(queryClient, id);
      return { previousData };
    },

    onError: (_err, _id, context) => {
      if (context?.previousData) {
        context.previousData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
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
      const previousData = queryClient.getQueriesData({
        queryKey: PRODUCTS_KEY,
      });

      updateProductInCache(queryClient, id, (product) => ({
        ...product,
        is_published: isPublished,
      }));

      return { previousData };
    },

    onError: (_err, _vars, context) => {
      if (context?.previousData) {
        context.previousData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast.error('Failed to update product status.');
    },

    onSuccess: (response, { id }) => {
      updateProductInCache(queryClient, id, () => response.data);
      toast.success('Product status updated.');
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_KEY });
    },
  });
}
