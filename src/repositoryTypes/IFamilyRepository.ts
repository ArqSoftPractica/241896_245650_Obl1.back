import { Family } from '@prisma/client';

export interface IFamilyRepository {
  findByFamilyName(familyName: string): Promise<Family | null>;
  findById(familyId: number): Promise<Family>;
  createFamily(familyName: string): Promise<Family>;
}
