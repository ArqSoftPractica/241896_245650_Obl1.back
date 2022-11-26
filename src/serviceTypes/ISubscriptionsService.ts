import { User } from '@prisma/client';
import { UpdateType } from './IEmailService';

export interface ISubscriptionsService {
  createSubscription(user: User, categoryId: number, entity: UpdateType): Promise<void>;
}
