import express from 'express';
import { Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import { InvalidDataError } from 'errors/InvalidDataError';
import { requireScopedAuth, requiresApiKey } from 'middlewares/requiresAuth';
import { validate } from 'middlewares/validate';
import { AddCategoryRequestSchema } from 'models/requests/AddCategoryRequest';
import 'reflect-metadata';
import { ICategoriesService } from 'serviceTypes/ICategoriesService';
import { SERVICE_SYMBOLS } from '../serviceTypes/serviceSymbols';
import { DeleteCategoryRequestSchema } from 'models/requests/DeleteCategoryRequest';
import { ResourceNotFoundError } from 'errors/ResourceNotFoundError';
import { UpdateCategoryRequestSchema } from 'models/requests/UpdateCategoryRequestSchema';

@injectable()
class CategoryController {
  public path = '/categories';
  public categoriesRouter = express.Router();

  public constructor(@inject(SERVICE_SYMBOLS.ICategoriesService) private _categoriesService: ICategoriesService) {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.categoriesRouter.post(
      this.path,
      requireScopedAuth('admin'),
      validate(AddCategoryRequestSchema),
      this.addCategory,
    );
    this.categoriesRouter.put(
      `${this.path}/:categoryId`,
      requireScopedAuth('admin'),
      validate(UpdateCategoryRequestSchema),
      this.updateCategory,
    );
    this.categoriesRouter.delete(
      `${this.path}/:categoryId`,
      requireScopedAuth('admin'),
      validate(DeleteCategoryRequestSchema),
      this.deleteCategory,
    );
    this.categoriesRouter.get(`${this.path}/ranking`, requiresApiKey, this.getTop3CategoriesWithMoreExpenses);
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
        return;
      }
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  public updateCategory = async (req: Request, res: Response) => {
    try {
      await this._categoriesService.updateCategory(req);
      res.status(200).json({
        message: `Category updated successfully.`,
      });
    } catch (err) {
      if (err instanceof ResourceNotFoundError) {
        res.status(err.code).json({ message: err.message });
        return;
      } else if (err instanceof InvalidDataError) {
        res.status(err.code).json({ message: err.message });
        return;
      }
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  public deleteCategory = async (req: Request, res: Response) => {
    try {
      await this._categoriesService.deleteCategory(req);
      res.status(200).json({ message: `Category deleted successfully.` });
    } catch (err) {
      if (err instanceof ResourceNotFoundError) {
        res.status(err.code).json({ message: err.message });
        return;
      }
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  public getTop3CategoriesWithMoreExpenses = async (req: Request, res: Response) => {
    try {
      const categories = await this._categoriesService.getTop3CategoriesWithMoreExpenses(req);
      res.status(200).json({
        message: `Top 3 categories with more expenses fetched successfully`,
        categories: categories,
      });
    } catch (err) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
}

export default CategoryController;
