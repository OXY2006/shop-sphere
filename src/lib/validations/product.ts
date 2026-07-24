import { z } from "zod";

export const productSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Product name must be at least 3 characters")
    .max(150),

  slug: z
    .string()
    .trim()
    .min(3)
    .regex(/^[a-z0-9-]+$/, "Invalid slug"),

  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters"),

  sku: z
    .string()
    .trim()
    .min(3)
    .max(50),

  price: z.coerce
    .number()
    .positive("Price must be greater than 0"),

  stock: z.coerce
    .number()
    .int()
    .min(0, "Stock cannot be negative"),

  categoryId: z
    .string()
    .cuid("Invalid category"),

  brandId: z
    .string()
    .cuid("Invalid brand")
    .optional()
    .nullable(),

  isActive: z.boolean().default(true),

  images: z
    .array(z.string().url())
    .min(1, "At least one image is required"),
});

export type ProductInput = z.infer<typeof productSchema>;