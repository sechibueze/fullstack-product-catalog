// match  what the API returns before transformation
export interface RawCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  products_count?: number;
}

export interface RawReview {
  id: string;
  product_id: string;
  reviewer_name: string;
  email: string;
  rating: number;
  body: string;
  is_approved: boolean;
  created_at: string;
  product?: RawProduct;
}

export interface RawProduct {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  description: string | null;
  price: string;
  stock_qty: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  average_rating?: number | null;
  approved_reviews_count?: number;
  reviews_count?: number;
  category?: RawCategory;
  reviews?: {
    data: RawReview[];
    meta: RawPaginationMeta;
    links: RawPaginationLinks;
  };
}

export interface RawPaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number | null;
  to: number | null;
}

export interface RawPaginationLinks {
  first: string | null;
  last: string | null;
  prev: string | null;
  next: string | null;
}

export interface RawPaginatedResponse<T> {
  data: T[];
  meta: RawPaginationMeta;
  links: RawPaginationLinks;
}

export interface RawApiResponse<T> {
  data: T;
  message: string;
}
