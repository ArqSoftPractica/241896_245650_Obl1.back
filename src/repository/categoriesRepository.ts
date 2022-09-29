import client from 'models/client';
import { injectable } from 'inversify';
import { Category, Prisma } from '@prisma/client';
import 'reflect-metadata';
import { ICategoryRepository } from 'repositoryTypes/ICategoriesRepository';
import { CategoryDTO } from 'models/responses/CategoryDTO';
import { Top3CategoryWithMoreExpenses } from 'models/responses/Top3CategoryWithMoreExpenses';

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

  public async createCategory(category: Prisma.CategoryCreateInput): Promise<CategoryDTO> {
    const categoryCreated = (await client.category.create({
      data: category,
      select: {
        id: true,
        name: true,
        description: true,
        monthlySpendingLimit: true,
        image: true,
        createdAt: true,
      },
    })) as CategoryDTO;
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

  public async getTop3CategoriesWithMoreExpenses(familyId: number): Promise<Top3CategoryWithMoreExpenses[]> {
    const top3CategoriesWithMoreExpenses: Top3CategoryWithMoreExpenses[] = await client.$queryRaw`
      SELECT
        category.name,
        category.id,
        SUM(expense.amount) AS totalAmount
      FROM
        expense
      INNER JOIN category ON expense.categoryId = category.id
      WHERE
        category.familyId = ${familyId}
        AND expense.deleted IS NULL
        AND category.deleted IS NULL
      GROUP BY
        category.id
      ORDER BY
        totalAmount DESC
      LIMIT 3
    `;
    return top3CategoriesWithMoreExpenses;
  }

  public async findMany(params: Prisma.CategoryFindManyArgs): Promise<CategoryDTO[]> {
    const categories = await client.category.findMany(params);
    return categories;
  }
}

export default CategoriesRepository;
