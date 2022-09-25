import { z } from 'zod';

export const AddCategoryRequestSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    description: z.string().min(1),
    monthlySpendingLimit: z.number().min(0) || z.null(),
  }),
});

export type AddCategoryRequest = z.infer<typeof AddCategoryRequestSchema>;
