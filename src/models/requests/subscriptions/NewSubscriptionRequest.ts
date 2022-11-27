import { z } from 'zod';

export const NewSubscriptionRequestSchema = z.object({
  body: z.object({
    categoryId: z.number().min(1),
    isSpendingSubscription: z.boolean().optional().default(false),
  }),
});

export type NewSubscriptionRequest = z.infer<typeof NewSubscriptionRequestSchema>;
