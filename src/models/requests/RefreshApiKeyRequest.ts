import { z } from 'zod';

export const RefreshApiKeyRequestSchema = z.object({
  params: z.object({
    familyId: z.number(),
  }),
});

export type RefreshApiKeyRequest = z.infer<typeof RefreshApiKeyRequestSchema>;
