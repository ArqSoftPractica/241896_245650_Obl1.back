import { Prisma } from '@prisma/client';
import { AddCategoryResponse } from 'models/responses/AddCategoryResponse';

export interface ICategoryRepository {
  categoryExistsInFamily(categoryName: string, familyId: number): Promise<boolean>;
  createCategory(category: Prisma.CategoryCreateInput): Promise<AddCategoryResponse>;
}
