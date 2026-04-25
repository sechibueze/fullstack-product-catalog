import {
  ProductWithCategory,
  PaginatedResponse,
  ApiResponse,
} from '@/db/schema';

const API_URL = process.env.API_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL;

// Fetch helpers

// revalidate 60s for products
async function fetchProducts(params: Record<string, string> = {}) {
  const query = new URLSearchParams(params).toString();
  const url = `${API_URL}/products${query ? `?${query}` : ''}`;

  const res = await fetch(url, {
    next: { revalidate: 60 }, // ISR 60s for products
    headers: { Accept: 'application/json' },
  });

  if (!res.ok) throw new Error(`Failed to fetch products: ${res.status}`);
  return res.json() as Promise<PaginatedResponse<ProductWithCategory>>;
}

async function fetchProduct(slug: string) {
  const res = await fetch(`${API_URL}/products/${slug}`, {
    next: { revalidate: 60 },
    headers: { Accept: 'application/json' },
  });

  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Failed to fetch product: ${res.status}`);

  const json = (await res.json()) as ApiResponse<ProductWithCategory>;
  return json.data;
}

// Exported service functions
export async function getProducts(params: Record<string, string> = {}) {
  return fetchProducts(params);
}

export async function getFeaturedProducts() {
  return fetchProducts({ per_page: '8', page: '1' });
}

export async function getProduct(slug: string) {
  return fetchProduct(slug);
}

export async function getAllProductSlugs(): Promise<string[]> {
  // fetch all published slugs
  const data = await fetchProducts({ per_page: '100' });
  return data.data.map((p) => p.slug);
}
