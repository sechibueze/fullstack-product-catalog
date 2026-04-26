import { z } from 'zod';

// Form schema
export const productSchema = z.object({
  category_id: z.string().uuid('Please select a valid category'),
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(200, 'Name cannot exceed 200 characters'),
  description: z
    .string()
    .max(5000, 'Description cannot exceed 5000 characters')
    .optional(),
  price: z
    .number()
    .min(0, 'Price cannot be negative')
    .max(999999.99, 'Price cannot exceed 999,999.99'),
  stock_qty: z
    .number()
    .int('Stock must be a whole number')
    .min(0, 'Stock cannot be negative')
    .max(999999, 'Stock cannot exceed 999,999'),
  is_published: z.boolean(),
  slug: z.string().max(220, 'Slug cannot exceed 220 characters').optional(),
});

export type ProductFormData = z.infer<typeof productSchema>;
