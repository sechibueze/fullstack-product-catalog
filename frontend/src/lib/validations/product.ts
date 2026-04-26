import { z } from 'zod';

export const productSchema = z.object({
  category_id: z.string().uuid('Please select a valid category'),
  name: z.string().min(2, 'Name must be at least 2 characters').max(200),
  description: z.string().max(5000).optional(),
  price: z.coerce.number().min(0, 'Price cannot be negative').max(999999.99),
  stock_qty: z.coerce
    .number()
    .int()
    .min(0, 'Stock cannot be negative')
    .max(999999),
  is_published: z.boolean().default(false),
  slug: z.string().max(220).optional(),
});

export type ProductFormData = z.infer<typeof productSchema>;
