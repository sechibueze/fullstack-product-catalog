import { ReviewWithProduct, PaginatedResponse, ApiResponse } from '@/db/schema';

const API_URL = process.env.API_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL;

export async function getReviews(params: Record<string, string> = {}) {
  const query = new URLSearchParams(params).toString();
  const url = `${API_URL}/reviews${query ? `?${query}` : ''}`;

  const res = await fetch(url, {
    next: { revalidate: 60 },
    headers: { Accept: 'application/json' },
  });

  if (!res.ok) throw new Error(`Failed to fetch reviews: ${res.status}`);
  return res.json() as Promise<PaginatedResponse<ReviewWithProduct>>;
}

export async function getReview(id: string) {
  const res = await fetch(`${API_URL}/reviews/${id}`, {
    next: { revalidate: 60 },
    headers: { Accept: 'application/json' },
  });

  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Failed to fetch review: ${res.status}`);

  const json = (await res.json()) as ApiResponse<ReviewWithProduct>;
  return json.data;
}
