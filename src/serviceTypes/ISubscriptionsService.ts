import { User } from '@prisma/client';

export interface ISubscriptionsService {
  createSubscription(user: User, categoryId: number): Promise<void>;
  deleteSubscription(user: User, subscriptionId: number): Promise<void>;
}
