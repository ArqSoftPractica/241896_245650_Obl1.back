import { Request } from 'express';
import { CategoryDTO } from 'models/responses/CategoryDTO';
import { Top3CategoryWithMoreExpenses } from 'models/responses/Top3CategoryWithMoreExpenses';

export interface ICategoriesService {
  addCategory(req: Request): Promise<CategoryDTO>;
  updateCategory(req: Request): Promise<void>;
  deleteCategory(req: Request): Promise<void>;
  getTop3CategoriesWithMoreExpenses(req: Request): Promise<Top3CategoryWithMoreExpenses[]>;
  getCategories(req: Request): Promise<CategoryDTO[]>;
}
