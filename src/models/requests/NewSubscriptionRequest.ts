import { z } from 'zod';

export const NewSubscriptionRequestSchema = z.object({
  body: z.object({
    entity: z.enum(['expense', 'income']),
    categoryId: z.number().min(1),
  }),
});

export type NewSubscriptionRequest = z.infer<typeof NewSubscriptionRequestSchema>;
