import client from 'models/client';
import { injectable } from 'inversify';
import { Prisma } from '@prisma/client';
import 'reflect-metadata';
import { ICategoryRepository } from 'repositoryTypes/ICategoriesRepository';
import { AddCategoryResponse } from 'models/responses/AddCategoryResponse';

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

  public async createCategory(category: Prisma.CategoryCreateInput): Promise<AddCategoryResponse> {
    const categoryCreated = (await client.category.create({
      data: category,
      select: {
        id: true,
        name: true,
        description: true,
        monthlySpendingLimit: true,
        imageURL: true,
        createdAt: true,
      },
    })) as AddCategoryResponse;
    return categoryCreated;
  }
}

export default CategoriesRepository;
