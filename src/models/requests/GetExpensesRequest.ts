import { z } from 'zod';

export const GetExpensesRequestSchema = z.object({
  query: z.object({
    from: z
      .preprocess((arg) => {
        if (typeof arg == 'string') return parseInt(arg);
      }, z.number())
      .optional(),
    to: z
      .preprocess((arg) => {
        if (typeof arg == 'string') return parseInt(arg);
      }, z.number())
      .optional(),
    skip: z
      .preprocess((arg) => {
        if (typeof arg == 'string') return parseInt(arg);
      }, z.number())
      .optional(),
    take: z
      .preprocess((arg) => {
        if (typeof arg == 'string') return parseInt(arg);
      }, z.number())
      .optional(),
  }),
});

export type GetExpensesRequest = z.infer<typeof GetExpensesRequestSchema>;
