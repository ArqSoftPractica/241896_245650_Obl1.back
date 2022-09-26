import { Category, Prisma } from '@prisma/client';
import { AddCategoryResponse } from 'models/responses/AddCategoryResponse';

export interface ICategoryRepository {
  categoryExistsInFamily(categoryName: string, familyId: number): Promise<boolean>;
  createCategory(category: Prisma.CategoryCreateInput): Promise<AddCategoryResponse>;
  updateCategory(categoryId: number, newData: Prisma.CategoryCreateInput): Promise<void>;
  deleteCategory(categoryId: number): Promise<void>;
  findById(categoryId: number): Promise<Category | null>;
}
