import { z } from 'zod';

export const DeleteSubscriptionRequestSchema = z.object({
  params: z.object({
    id: z.preprocess((arg) => {
      if (typeof arg == 'string') return parseInt(arg);
    }, z.number()),
  }),
});

export type DeleteSubscriptionRequest = z.infer<typeof DeleteSubscriptionRequestSchema>;
