import { Family } from '@prisma/client';

export interface IFamilyRepository {
  findByFamilyName(familyName: string): Promise<Family | null>;
  createFamily(familyName: string): Promise<Family>;
}