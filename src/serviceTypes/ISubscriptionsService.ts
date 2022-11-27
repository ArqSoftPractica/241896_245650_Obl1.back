import { User } from '@prisma/client';

export interface ISubscriptionsService {
  createSubscription(user: User, categoryId: number, isSpendingSubscription: boolean): Promise<void>;
  deleteSubscription(user: User, subscriptionId: number): Promise<void>;
}
