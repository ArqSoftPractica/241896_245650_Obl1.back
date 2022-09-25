import { Request } from 'express';
import { AddCategoryResponse } from 'models/responses/AddCategoryResponse';

export interface ICategoriesService {
  addCategory(req: Request): Promise<AddCategoryResponse>;
}
