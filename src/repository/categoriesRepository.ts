import client from 'models/client';
import { injectable } from 'inversify';
import { Category, Prisma } from '@prisma/client';
import 'reflect-metadata';
import { ICategoryRepository } from 'repositoryTypes/ICategoriesRepository';

@injectable()
class CategoriesRepository implements ICategoryRepository {
  public async categoryExistsInFamily(categoryName: string, familyId: number): Promise<boolean> {
    const category = await client.category.findFirst({
      where: {
        name: categoryName,
        family: {
          id: familyId,
        },
      },
    });
    return !!category;
  }

  public async createCategory(category: Prisma.CategoryCreateInput): Promise<Category> {
    return await client.category.create({ data: category });
  }

  public async findById(categoryId: number): Promise<Category | null> {
    return await client.category.findFirst({ where: { id: categoryId } });
  }
}

export default CategoriesRepository;
