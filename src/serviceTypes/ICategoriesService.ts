import { Request } from 'express';
import { AddCategoryResponse } from 'models/responses/AddCategoryResponse';

export interface ICategoriesService {
  addCategory(req: Request): Promise<AddCategoryResponse>;
  updateCategory(req: Request): Promise<void>;
  deleteCategory(req: Request): Promise<void>;
}
