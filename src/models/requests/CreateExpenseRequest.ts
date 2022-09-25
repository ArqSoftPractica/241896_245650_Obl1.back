import { z } from 'zod';
import client from 'models/client';

import myContainer from 'factory/inversify.config';
import { REPOSITORY_SYMBOLS } from 'repositoryTypes/repositorySymbols';
import { IFamilyRepository } from 'repositoryTypes/IFamilyRepository';

// TODO: CHECK CATEGORY EXISTS
const familyRepository = myContainer.get<IFamilyRepository>(REPOSITORY_SYMBOLS.IFamilyRepository);

const familyNameIsUnique = async (familyName: string) => {
  const family = await familyRepository.findByFamilyName(familyName);
  return !family;
};

export const CreateExpenseRequestSchema = z.object({
  body: z.object({
    amount: z.number().min(0),
    date: z.preprocess((arg) => {
      console.log('arg', arg);
      if (typeof arg == "string" || arg instanceof Date) return new Date(arg);
    }, z.date()),
    categoryId: z.number().min(1),
  }),
});

export type CreateExpenseRequest = z.infer<typeof CreateExpenseRequestSchema>;