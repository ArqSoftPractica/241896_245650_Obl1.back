import { z } from 'zod';
import client from 'models/client';

import myContainer from 'factory/inversify.config';
import { REPOSITORY_SYMBOLS } from 'repositoryTypes/repositorySymbols';
import { IFamilyRepository } from 'repositoryTypes/IFamilyRepository';

const familyRepository = myContainer.get<IFamilyRepository>(REPOSITORY_SYMBOLS.IFamilyRepository);

const familyNameIsUnique = async (familyName: string) => {
  const family = await familyRepository.findByFamilyName(familyName);
  return !family;
};

export const RegisterAdminRequestSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: 'Email is required',
      })
      .email('Not a valid email'),
    password: z.string().min(8),
    familyName: z.string().refine(familyNameIsUnique, {
      message: 'Family name is already taken',
    }),
  }),
});
