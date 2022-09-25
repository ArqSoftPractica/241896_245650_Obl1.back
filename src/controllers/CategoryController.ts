import express from 'express';
import { Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import { InvalidDataError } from 'errors/InvalidDataError';
import { requireScopedAuth } from 'middlewares/requiresAuth';
import { validate } from 'middlewares/validate';
import { AddCategoryRequestSchema } from 'models/requests/AddCategoryRequest';
import 'reflect-metadata';
import { ICategoriesService } from 'serviceTypes/ICategoriesService';
import { SERVICE_SYMBOLS } from '../serviceTypes/serviceSymbols';

@injectable()
class CategoryController {
  public path = '/categories';
  public usersRouter = express.Router();

  public constructor(@inject(SERVICE_SYMBOLS.ICategoriesService) private _categoriesService: ICategoriesService) {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.usersRouter.post(this.path, requireScopedAuth('admin'), validate(AddCategoryRequestSchema), this.addCategory);
  }

  public addCategory = async (req: Request, res: Response) => {
    try {
      const categoryAdded = await this._categoriesService.addCategory(req);
      res.status(201).json({
        message: `Category added successfully.`,
        category: categoryAdded,
      });
    } catch (err) {
      if (err instanceof InvalidDataError) {
        res.status(err.code).json({ message: err.message });
      }
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
}

export default CategoryController;
