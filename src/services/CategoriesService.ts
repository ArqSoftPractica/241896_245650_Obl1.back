import { injectable, inject } from 'inversify';
import 'reflect-metadata';
import { REPOSITORY_SYMBOLS } from '../repositoryTypes/repositorySymbols';
import { ICategoriesService } from 'serviceTypes/ICategoriesService';
import { ICategoryRepository } from 'repositoryTypes/ICategoriesRepository';
import { AuthRequest } from 'middlewares/requiresAuth';
import { InvalidDataError } from 'errors/InvalidDataError';
import { AddCategoryResponse } from 'models/responses/AddCategoryResponse';
import { ResourceNotFoundError } from 'errors/ResourceNotFoundError';

@injectable()
class CategoriesService implements ICategoriesService {
  public constructor(
    @inject(REPOSITORY_SYMBOLS.ICategoriesRepository) private categoriesRepository: ICategoryRepository,
  ) {}

  public async addCategory(req: AuthRequest): Promise<AddCategoryResponse> {
    const {
      body: { name, description, monthlySpendingLimit },
      user: { familyId },
    } = req;
    await this.checkIfCategoryNameExistsInFamily(name, familyId);
    const category = {
      name,
      description,
      monthlySpendingLimit,
      imageURL: 'https://www.google.com',
      family: {
        connect: {
          id: familyId,
        },
      },
    };

    const categoryAdded = await this.categoriesRepository.createCategory(category);
    return categoryAdded;
  }

  private async checkIfCategoryNameExistsInFamily(categoryName: string, familyId: number): Promise<void> {
    const categoryExists = await this.categoriesRepository.categoryExistsInFamily(categoryName, familyId);
    if (categoryExists) {
      throw new InvalidDataError('Category already exists in family');
    }
  }

  public async updateCategory(req: AuthRequest): Promise<void> {
    const {
      params: { categoryId },
      user: { familyId },
      body,
    } = req;

    await this.checkCategoryIsInFamily(+categoryId, familyId);
    await this.categoriesRepository.updateCategory(+categoryId, body);
  }

  public async deleteCategory(req: AuthRequest): Promise<void> {
    const {
      params: { categoryId },
      user: { familyId },
    } = req;
    await this.checkCategoryIsInFamily(+categoryId, familyId);
    await this.categoriesRepository.deleteCategory(+categoryId);
  }

  private async checkCategoryIsInFamily(categoryId: number, familyId: number): Promise<void> {
    const category = await this.categoriesRepository.findById(categoryId);
    const isNotCategoryInFamily = !category || category.familyId !== familyId;
    if (isNotCategoryInFamily) throw new ResourceNotFoundError('Category not found');
  }
}

export default CategoriesService;
