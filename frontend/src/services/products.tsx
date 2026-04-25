import {
  ProductWithCategory,
  CategoryWithCount,
  ReviewWithProduct,
  PaginatedResponse,
} from '@/db/schema';
import {
  RawProduct,
  RawCategory,
  RawReview,
  RawPaginatedResponse,
  RawPaginationMeta,
} from '@/types/api';

const API_URL = process.env.API_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL;

// Transformers

function transformMeta(meta: RawPaginationMeta) {
  return {
    currentPage: meta.current_page,
    lastPage: meta.last_page,
    perPage: meta.per_page,
    total: meta.total,
    from: meta.from,
    to: meta.to,
  };
}

function transformReview(raw: RawReview): ReviewWithProduct {
  return {
    id: raw.id,
    productId: raw.product_id,
    reviewerName: raw.reviewer_name,
    email: raw.email,
    rating: raw.rating,
    body: raw.body,
    isApproved: raw.is_approved,
    createdAt: new Date(raw.created_at),
  };
}

function transformCategory(raw: RawCategory): CategoryWithCount {
  return {
    id: raw.id,
    name: raw.name,
    slug: raw.slug,
    description: raw.description,
    createdAt: new Date(raw.created_at),
    updatedAt: new Date(raw.updated_at),
    deletedAt: raw.deleted_at ? new Date(raw.deleted_at) : null,
    productsCount: raw.products_count ?? 0,
  };
}

function transformProduct(raw: RawProduct): ProductWithCategory {
  return {
    id: raw.id,
    categoryId: raw.category_id,
    name: raw.name,
    slug: raw.slug,
    description: raw.description,
    price: raw.price,
    stockQty: raw.stock_qty,
    isPublished: raw.is_published,
    createdAt: new Date(raw.created_at),
    updatedAt: new Date(raw.updated_at),
    deletedAt: raw.deleted_at ? new Date(raw.deleted_at) : null,
    averageRating: raw.average_rating ?? null,
    approvedReviewsCount: raw.approved_reviews_count ?? 0,
    reviewsCount: raw.reviews_count ?? 0,
    category: raw.category ? transformCategory(raw.category) : undefined,
    reviews: raw.reviews
      ? {
          data: raw.reviews.data.map(transformReview),
          meta: transformMeta(raw.reviews.meta),
          links: raw.reviews.links,
        }
      : undefined,
  };
}

function transformPaginated(
  raw: RawPaginatedResponse<RawProduct>,
): PaginatedResponse<ProductWithCategory> {
  return {
    data: raw.data.map(transformProduct),
    meta: transformMeta(raw.meta),
    links: raw.links,
  };
}

// Empty response fallback

const emptyPaginatedResponse = (): PaginatedResponse<ProductWithCategory> => ({
  data: [],
  meta: {
    currentPage: 1,
    lastPage: 1,
    perPage: 12,
    total: 0,
    from: null,
    to: null,
  },
  links: { first: null, last: null, prev: null, next: null },
});

// Fetch functions

async function fetchProducts(
  params: Record<string, string> = {},
): Promise<PaginatedResponse<ProductWithCategory>> {
  const query = new URLSearchParams(params).toString();
  const url = `${API_URL}/products${query ? `?${query}` : ''}`;

  try {
    const res = await fetch(url, {
      next: { revalidate: 60 },
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) throw new Error(`Failed to fetch products: ${res.status}`);
    const json = (await res.json()) as RawPaginatedResponse<RawProduct>;
    return transformPaginated(json);
  } catch (error) {
    console.error('[fetchProducts]', error);
    return emptyPaginatedResponse();
  }
}

async function fetchProduct(slug: string): Promise<ProductWithCategory | null> {
  const url = `${API_URL}/products/${slug}`;

  try {
    const res = await fetch(url, {
      next: { revalidate: 60 },
      headers: { Accept: 'application/json' },
    });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`Failed to fetch product: ${res.status}`);
    const json = (await res.json()) as { data: RawProduct; message: string };
    return transformProduct(json.data);
  } catch (error) {
    console.error('[fetchProduct]', error);
    return null;
  }
}

// Exported service functions

export async function getProducts(
  params: Record<string, string> = {},
): Promise<PaginatedResponse<ProductWithCategory>> {
  return fetchProducts(params);
}

export async function getFeaturedProducts(): Promise<
  PaginatedResponse<ProductWithCategory>
> {
  return fetchProducts({ per_page: '8', page: '1' });
}

export async function getProduct(
  slug: string,
): Promise<ProductWithCategory | null> {
  return fetchProduct(slug);
}

export async function getAllProductSlugs(): Promise<string[]> {
  const data = await fetchProducts({ per_page: '100' });
  return data.data.map((p) => p.slug);
}
