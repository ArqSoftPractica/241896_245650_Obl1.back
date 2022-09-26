import client from 'models/client';
import { injectable } from 'inversify';
import { Category, Prisma } from '@prisma/client';
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

  public async updateCategory(categoryId: number, newData: Prisma.CategoryCreateInput): Promise<void> {
    await client.category.update({
      data: newData,
      where: { id: categoryId },
    });
  }

  public async deleteCategory(categoryId: number): Promise<void> {
    await client.category.delete({
      where: { id: categoryId },
    });
  }

  public async findById(categoryId: number): Promise<Category | null> {
    return await client.category.findFirst({ where: { id: categoryId } });
  }
}

export default CategoriesRepository;
