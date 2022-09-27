import { Request } from 'express';
import { AddCategoryResponse } from 'models/responses/AddCategoryResponse';
import { ExpenseDTO } from 'models/responses/ExpenseDTO';
import { Top3CategoryWithMoreExpenses } from 'models/responses/Top3CategoryWithMoreExpenses';

export interface ICategoriesService {
  addCategory(req: Request): Promise<AddCategoryResponse>;
  updateCategory(req: Request): Promise<void>;
  deleteCategory(req: Request): Promise<void>;
  getTop3CategoriesWithMoreExpenses(req: Request): Promise<Top3CategoryWithMoreExpenses[]>;
  getExpensesOfCategory(req: Request): Promise<ExpenseDTO[]>;
}
