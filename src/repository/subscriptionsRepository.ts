import client from 'models/client';
import { injectable } from 'inversify';
import 'reflect-metadata';
import ISubscriptionsRepository from 'repositoryTypes/ISubscriptionsrepository';
import { ResourceNotFoundError } from 'errors/ResourceNotFoundError';

@injectable()
class SubscriptionsRepository implements ISubscriptionsRepository {
  public async createSubscription(userId: number, categoryId: number, isSpendingSubscription: boolean): Promise<void> {
    await client.subscription.create({
      data: {
        categoryId,
        isSpendingSubscription,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  public async deleteSubscription(userId: number, subscriptionId: number): Promise<void> {
    const user = await client.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        subscriptions: true,
      },
    });
    if (!user) throw new ResourceNotFoundError('User not found');

    const subscription = user.subscriptions.find((s) => s.id === subscriptionId);
    if (!subscription) throw new ResourceNotFoundError('Subscription not found');

    await client.subscription.delete({
      where: {
        id: subscriptionId,
      },
    });
  }
}

export default SubscriptionsRepository;
