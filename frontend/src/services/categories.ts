import { CategoryWithCount, PaginatedResponse } from '@/db/schema';
import {
  RawCategory,
  RawPaginatedResponse,
  RawPaginationMeta,
} from '@/types/api';

const API_URL = process.env.API_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL;

// Transformers

function transformMeta(meta: RawPaginationMeta | undefined) {
  if (!meta) {
    return {
      currentPage: 1,
      lastPage: 1,
      perPage: 15,
      total: 0,
      from: null,
      to: null,
    };
  }
  return {
    currentPage: meta.current_page,
    lastPage: meta.last_page,
    perPage: meta.per_page,
    total: meta.total,
    from: meta.from,
    to: meta.to,
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

function transformPaginatedCategories(
  raw: RawPaginatedResponse<RawCategory>,
): PaginatedResponse<CategoryWithCount> {
  return {
    data: raw.data.map(transformCategory),
    meta: transformMeta(raw.meta),
    links: raw.links,
  };
}

const emptyPaginatedResponse = (): PaginatedResponse<CategoryWithCount> => ({
  data: [],
  meta: {
    currentPage: 1,
    lastPage: 1,
    perPage: 15,
    total: 0,
    from: null,
    to: null,
  },
  links: { first: null, last: null, prev: null, next: null },
});

//  Fetch functions
async function fetchCategories(
  params: Record<string, string> = {},
): Promise<PaginatedResponse<CategoryWithCount>> {
  const query = new URLSearchParams(params).toString();
  const url = `${API_URL}/categories${query ? `?${query}` : ''}`;

  try {
    const res = await fetch(url, {
      next: { revalidate: 300 },
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) throw new Error(`Failed to fetch categories: ${res.status}`);
    const json = (await res.json()) as RawPaginatedResponse<RawCategory>;
    return transformPaginatedCategories(json);
  } catch (error) {
    console.error('[fetchCategories]', error);
    return emptyPaginatedResponse();
  }
}

async function fetchCategory(slug: string): Promise<CategoryWithCount | null> {
  const url = `${API_URL}/categories/${slug}`;

  try {
    const res = await fetch(url, {
      next: { revalidate: 300 },
      headers: { Accept: 'application/json' },
    });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`Failed to fetch category: ${res.status}`);
    const json = (await res.json()) as { data: RawCategory; message: string };
    return transformCategory(json.data);
  } catch (error) {
    console.error('[fetchCategory]', error);
    return null;
  }
}

//  Exported service functions
export async function getCategories(
  params: Record<string, string> = {},
): Promise<PaginatedResponse<CategoryWithCount>> {
  return fetchCategories(params);
}

export async function getCategory(
  slug: string,
): Promise<CategoryWithCount | null> {
  return fetchCategory(slug);
}

export async function getAllCategorySlugs(): Promise<string[]> {
  const data = await fetchCategories({ per_page: '100' });
  return data.data.map((c) => c.slug);
}
