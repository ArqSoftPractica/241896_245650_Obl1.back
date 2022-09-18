import client from 'models/client';
import { Family } from '@prisma/client';
import { injectable } from 'inversify';
import 'reflect-metadata';
import { IFamilyRepository } from 'repositoryTypes/IFamilyRepository';

@injectable()
class FamilyRepository implements IFamilyRepository {
  createFamily(familyName: string): Promise<Family> {
    return client.family.create({ data: { name: familyName } });
  }
  public async findByFamilyName(familyName: string): Promise<Family | null> {
    return await client.family.findUnique({ where: { name: familyName } });
  }
}

export default FamilyRepository;
