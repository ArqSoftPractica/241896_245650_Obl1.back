import { Request } from 'express';
import { Category } from '@prisma/client';

export interface ICategoriesService {
  addCategory(req: Request): Promise<Category>;
}
