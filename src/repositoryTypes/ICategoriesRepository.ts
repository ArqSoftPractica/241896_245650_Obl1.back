import { Category, Prisma } from '@prisma/client';
import { AddCategoryResponse } from 'models/responses/AddCategoryResponse';
import { Top3CategoryWithMoreExpenses } from 'models/responses/Top3CategoryWithMoreExpenses';

export interface ICategoryRepository {
  getTop3CategoriesWithMoreExpenses(familyId: number): Promise<Top3CategoryWithMoreExpenses[]>;
  categoryExistsInFamily(categoryName: string, familyId: number): Promise<boolean>;
  createCategory(category: Prisma.CategoryCreateInput): Promise<AddCategoryResponse>;
  updateCategory(categoryId: number, newData: Prisma.CategoryCreateInput): Promise<void>;
  deleteCategory(categoryId: number): Promise<void>;
  findById(categoryId: number): Promise<Category | null>;
}
