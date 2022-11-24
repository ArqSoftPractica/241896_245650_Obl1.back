import client from 'models/client';
import { SubscriptableEntity } from '@prisma/client';
import { injectable } from 'inversify';
import 'reflect-metadata';
import ISubscriptionsRepository from 'repositoryTypes/ISubscriptionsrepository';

@injectable()
class SubscriptionsRepository implements ISubscriptionsRepository {
  public async createSubscription(userId: number, categoryId: number, entity: SubscriptableEntity): Promise<void> {
    await client.subscription.create({
      data: {
        categoryId,
        entity,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }
}

export default SubscriptionsRepository;
