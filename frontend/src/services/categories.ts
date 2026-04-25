import { CategoryWithCount, PaginatedResponse, ApiResponse } from '@/db/schema';

const API_URL = process.env.API_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL;

async function fetchCategories(params: Record<string, string> = {}) {
  const query = new URLSearchParams(params).toString();
  const url = `${API_URL}/categories${query ? `?${query}` : ''}`;

  const res = await fetch(url, {
    next: { revalidate: 300 },
    headers: { Accept: 'application/json' },
  });

  if (!res.ok) throw new Error(`Failed to fetch categories: ${res.status}`);
  return res.json() as Promise<PaginatedResponse<CategoryWithCount>>;
}

async function fetchCategory(slug: string) {
  const res = await fetch(`${API_URL}/categories/${slug}`, {
    next: { revalidate: 300 },
    headers: { Accept: 'application/json' },
  });

  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Failed to fetch category: ${res.status}`);

  const json = (await res.json()) as ApiResponse<CategoryWithCount>;
  return json.data;
}

export async function getCategories(params: Record<string, string> = {}) {
  return fetchCategories(params);
}

export async function getCategory(slug: string) {
  return fetchCategory(slug);
}

export async function getAllCategorySlugs(): Promise<string[]> {
  const data = await fetchCategories({ per_page: '100' });
  return data.data.map((c) => c.slug);
}
