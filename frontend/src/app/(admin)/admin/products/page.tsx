'use client';
import { useState } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Loader2,
  Package,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ProductFormModal } from '@/components/admin/products/ProductFormModal';
import { ConfirmModal } from '@/components/admin/ConfirmModal';
import { Pagination } from '@/components/ui/Pagination';
import {
  useAdminProducts,
  useAdminCategories,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
  useTogglePublished,
} from '@/hooks/admin/useAdminProducts';
import { RawProduct } from '@/types/api';
import { ProductFormData } from '@/lib/validations/product';
import { formatPrice } from '@/lib/utils';
import { getApiError } from '@/lib/api';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useQueryClient } from '@tanstack/react-query';

export default function AdminProductsPage() {
  const [page, setPage] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<RawProduct | null>(
    null,
  );

  const params = { page: String(page), per_page: '12' };

  const { data, isLoading, isError } = useAdminProducts(params);
  const { data: cats } = useAdminCategories();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  const togglePublished = useTogglePublished();

  const categories = cats?.data ?? [];
  const products = data?.data ?? [];
  const meta = data?.meta;

  const handleCreate = () => {
    setSelectedProduct(null);
    setIsFormOpen(true);
  };

  const handleEdit = (product: RawProduct) => {
    setSelectedProduct(product);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (product: RawProduct) => {
    setSelectedProduct(product);
    setIsDeleteOpen(true);
  };

  const handleFormSubmit = async (data: ProductFormData) => {
    try {
      if (selectedProduct) {
        await updateProduct.mutateAsync({
          id: selectedProduct.id,
          payload: data,
        });
      } else {
        await createProduct.mutateAsync(data);
      }
      setIsFormOpen(false);
      setSelectedProduct(null);
    } catch (error) {
      const err = getApiError(error);
      toast.error(err.message || 'Operation failed.');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedProduct) return;
    try {
      await deleteProduct.mutateAsync(selectedProduct.id);
      setIsDeleteOpen(false);
      setSelectedProduct(null);
    } catch {
      toast.error('Failed to delete product.');
    }
  };

  const handleTogglePublished = (product: RawProduct) => {
    togglePublished.mutate({
      id: product.id,
      isPublished: !product.is_published,
    });
  };

  return (
    <div className='space-y-6'>
      {/*  Header  */}
      <div className='flex items-center justify-between gap-4'>
        <div>
          <h1 className='text-2xl font-bold text-text-primary'>Products</h1>
          <p className='text-sm text-text-secondary mt-0.5'>
            Manage your product catalog
          </p>
        </div>
        <Button onClick={handleCreate} variant='primary' size='sm'>
          <Plus className='h-4 w-4' aria-hidden='true' />
          Add Product
        </Button>
      </div>

      {/*  Table  */}
      <div className='rounded-xl border border-border bg-surface overflow-hidden'>
        {/* Admin tables scroll horizontally on small screens with sticky first column */}
        <div className='overflow-x-auto'>
          <table className='w-full min-w-[700px] text-sm'>
            <thead>
              <tr className='border-b border-border bg-bg-secondary'>
                <th
                  scope='col'
                  className='sticky left-0 bg-bg-secondary px-4 py-3 text-left font-semibold text-text-secondary whitespace-nowrap'
                >
                  Product
                </th>
                <th
                  scope='col'
                  className='px-4 py-3 text-left font-semibold text-text-secondary whitespace-nowrap'
                >
                  Category
                </th>
                <th
                  scope='col'
                  className='px-4 py-3 text-left font-semibold text-text-secondary whitespace-nowrap'
                >
                  Price
                </th>
                <th
                  scope='col'
                  className='px-4 py-3 text-left font-semibold text-text-secondary whitespace-nowrap'
                >
                  Stock
                </th>
                <th
                  scope='col'
                  className='px-4 py-3 text-left font-semibold text-text-secondary whitespace-nowrap'
                >
                  Status
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
                  <td colSpan={6} className='px-4 py-12 text-center'>
                    <Loader2
                      className='h-6 w-6 animate-spin text-primary mx-auto'
                      aria-label='Loading products'
                    />
                  </td>
                </tr>
              )}

              {isError && (
                <tr>
                  <td
                    colSpan={6}
                    className='px-4 py-12 text-center text-danger text-sm'
                  >
                    Failed to load products. Please refresh.
                  </td>
                </tr>
              )}

              {!isLoading && !isError && !products.length && (
                <tr>
                  <td colSpan={6} className='px-4 py-12 text-center'>
                    <Package
                      className='h-10 w-10 text-text-tertiary mx-auto mb-2'
                      aria-hidden='true'
                    />
                    <p className='text-text-secondary text-sm'>
                      No products yet. Create your first one.
                    </p>
                  </td>
                </tr>
              )}

              {products.map((product) => (
                <tr
                  key={product.id}
                  className='hover:bg-bg-secondary transition-colors duration-fast'
                >
                  {/* Name with sticky first column */}
                  <td className='sticky left-0 bg-surface px-4 py-3 font-medium text-text-primary whitespace-nowrap max-w-[200px] truncate'>
                    {product.name}
                  </td>

                  {/* Category */}
                  <td className='px-4 py-3 text-text-secondary whitespace-nowrap'>
                    {' '}
                    {product.category?.name ?? '—'}
                  </td>

                  {/* Price */}
                  <td className='px-4 py-3 text-text-primary whitespace-nowrap font-medium'>
                    {formatPrice(parseFloat(product.price))}
                  </td>

                  {/* Stock */}
                  <td className='px-4 py-3 whitespace-nowrap'>
                    <span
                      className={cn(
                        'text-sm font-medium',
                        product.stock_qty === 0
                          ? 'text-danger'
                          : product.stock_qty < 10
                            ? 'text-warning'
                            : 'text-success',
                      )}
                    >
                      {product.stock_qty}
                    </span>
                  </td>

                  {/* Status */}
                  <td className='px-4 py-3 whitespace-nowrap'>
                    <Badge
                      variant={product.is_published ? 'success' : 'default'}
                    >
                      {product.is_published ? 'Published' : 'Draft'}
                    </Badge>
                  </td>

                  {/* Actions */}
                  <td className='px-4 py-3 whitespace-nowrap'>
                    <div className='flex items-center justify-end gap-1'>
                      {/* Toggle published */}
                      <button
                        onClick={() => handleTogglePublished(product)}
                        disabled={togglePublished.isPending}
                        aria-label={
                          product.is_published
                            ? 'Unpublish product'
                            : 'Publish product'
                        }
                        title={product.is_published ? 'Unpublish' : 'Publish'}
                        className={cn(
                          'p-1.5 rounded-md transition-colors duration-fast',
                          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                          product.is_published
                            ? 'text-success hover:bg-success-light'
                            : 'text-text-tertiary hover:bg-bg-secondary',
                        )}
                      >
                        {product.is_published ? (
                          <Eye className='h-4 w-4' aria-hidden='true' />
                        ) : (
                          <EyeOff className='h-4 w-4' aria-hidden='true' />
                        )}
                      </button>

                      {/* Edit */}
                      <button
                        onClick={() => handleEdit(product)}
                        aria-label={`Edit ${product.name}`}
                        title='Edit'
                        className='p-1.5 rounded-md text-text-secondary hover:bg-info-light hover:text-info transition-colors duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary'
                      >
                        <Pencil className='h-4 w-4' aria-hidden='true' />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => handleDeleteClick(product)}
                        aria-label={`Delete ${product.name}`}
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
              currentPage={page}
              lastPage={meta.last_page}
              baseUrl='/admin/products'
              onPageChange={setPage}
            />
          </div>
        )}
      </div>

      {/* ── Modals ───────────────────────────────────────────── */}
      <ProductFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedProduct(null);
        }}
        onSubmit={handleFormSubmit}
        categories={categories}
        product={selectedProduct}
        isLoading={createProduct.isPending || updateProduct.isPending}
      />

      <ConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setSelectedProduct(null);
        }}
        onConfirm={handleDeleteConfirm}
        title='Delete Product'
        message={`Are you sure you want to delete "${selectedProduct?.name}"? This action cannot be undone.`}
        isLoading={deleteProduct.isPending}
      />
    </div>
  );
}
