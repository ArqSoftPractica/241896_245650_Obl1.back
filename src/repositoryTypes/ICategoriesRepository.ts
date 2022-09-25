import { Prisma, Category } from '@prisma/client';

export interface ICategoryRepository {
  categoryExistsInFamily(categoryName: string, familyId: number): Promise<boolean>;
  createCategory(category: Prisma.CategoryCreateInput): Promise<Category>;
  findById(categoryId: number): Promise<Category | null>;
}
