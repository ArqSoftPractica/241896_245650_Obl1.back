import { injectable, inject } from 'inversify';
import 'reflect-metadata';
import { REPOSITORY_SYMBOLS } from '../repositoryTypes/repositorySymbols';
import { User } from '@prisma/client';
import { UpdateType } from 'serviceTypes/IEmailService';
import { ISubscriptionsService } from 'serviceTypes/ISubscriptionsService';
import ISubscriptionsRepository from 'repositoryTypes/ISubscriptionsrepository';
import { ResourceNotFoundError } from 'errors/ResourceNotFoundError';
import { ICategoryRepository } from 'repositoryTypes/ICategoriesRepository';

@injectable()
class SubscriptionsService implements ISubscriptionsService {
  public constructor(
    @inject(REPOSITORY_SYMBOLS.ISubscriptionsRepository) private subscriptionsRepository: ISubscriptionsRepository,
    @inject(REPOSITORY_SYMBOLS.ICategoriesRepository) private categoriesRepository: ICategoryRepository,
  ) {}

  public async createSubscription(user: User, categoryId: number, entity: UpdateType): Promise<void> {
    await this.checkCategoryIsInFamily(+categoryId, user.familyId);
    await this.subscriptionsRepository.createSubscription(user.id, categoryId, entity);
  }

  private async checkCategoryIsInFamily(categoryId: number, familyId: number): Promise<void> {
    const category = await this.categoriesRepository.findById(categoryId);
    const isNotCategoryInFamily = !category || category.familyId !== familyId;
    if (isNotCategoryInFamily) throw new ResourceNotFoundError('Category not found');
  }
}

export default SubscriptionsService;