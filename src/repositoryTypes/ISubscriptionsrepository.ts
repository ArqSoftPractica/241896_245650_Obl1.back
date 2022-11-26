import { SubscriptableEntity } from '@prisma/client';

export default interface ISubscriptionsRepository {
  createSubscription(userId: number, categoryId: number, entity: SubscriptableEntity): Promise<void>;
  deleteSubscription(userId: number, subscriptionId: number): Promise<void>;
}
