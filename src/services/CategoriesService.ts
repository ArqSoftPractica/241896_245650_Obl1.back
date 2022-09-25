import { injectable, inject } from 'inversify';
import 'reflect-metadata';
import { REPOSITORY_SYMBOLS } from '../repositoryTypes/repositorySymbols';
import { ICategoriesService } from 'serviceTypes/ICategoriesService';
import { ICategoryRepository } from 'repositoryTypes/ICategoriesRepository';
import { AuthRequest } from 'middlewares/requiresAuth';
import { InvalidDataError } from 'errors/InvalidDataError';
import { AddCategoryResponse } from 'models/responses/AddCategoryResponse';

@injectable()
class CategoriesService implements ICategoriesService {
  public constructor(
    @inject(REPOSITORY_SYMBOLS.ICategoriesRepository) private categoriesRepository: ICategoryRepository,
  ) {}

  public async addCategory(req: AuthRequest): Promise<AddCategoryResponse> {
    const { body } = req;
    await this.checkIfCategoryExistsInFamily(body.name, req.user.familyId);
    const category = {
      name: body.name,
      description: body.description,
      monthlySpendingLimit: body.monthlySpendingLimit,
      imageURL: 'https://www.google.com',
      family: {
        connect: {
          id: req.user.familyId,
        },
      },
    };

    const categoryAdded = await this.categoriesRepository.createCategory(category);
    return categoryAdded;
  }

  public async checkIfCategoryExistsInFamily(categoryName: string, familyId: number): Promise<void> {
    const categoryExists = await this.categoriesRepository.categoryExistsInFamily(categoryName, familyId);
    if (categoryExists) {
      throw new InvalidDataError('Category already exists in family');
    }
  }
}

export default CategoriesService;
