import { Subscription, User } from '@prisma/client';
import myContainer from 'factory/inversify.config';
import { IUsersRepository } from 'repositoryTypes/IUsersRepository';
import { REPOSITORY_SYMBOLS } from 'repositoryTypes/repositorySymbols';
import { IEmailService, UpdateType } from 'serviceTypes/IEmailService';
import { SERVICE_SYMBOLS } from 'serviceTypes/serviceSymbols';
import Queue from 'bull';
import { SPENDING_LIMIT_QUEUE_NAME } from './categorySpendingLimitControlProcessingQueue';

const queue = new Queue(SPENDING_LIMIT_QUEUE_NAME, process.env.REDIS_URL ?? 'redis://');

export async function sendExpenseUpdateMiddleware<T>(
  response: T & { category?: { id: number } },
  user: User,
  type: UpdateType,
) {
  const updatedUser = await loadSubscriptions(user);
  const isSubscribed = updatedUser.subscriptions.some(
    (sub) => sub.categoryId === response.category?.id && !sub.isSpendingSubscription,
  );
  const needsToCheckSpendingLimit =
    type === 'expense' &&
    updatedUser.subscriptions.some((sub) => sub.categoryId === response.category?.id && sub.isSpendingSubscription);

  if (isSubscribed) {
    const emailService = myContainer.get<IEmailService>(SERVICE_SYMBOLS.IEmailService);
    await emailService.sendCategoryBalanceUpdateEmail(user.email, type, response, type);
  }

  console.log('Needs to check spending limit', needsToCheckSpendingLimit);

  if (needsToCheckSpendingLimit) {
    queue.add({ user: user, categoryId: response.category?.id });
  }

  return response;
}

const loadSubscriptions = async (user: User): Promise<User & { subscriptions: Subscription[] }> => {
  const usersRepository = myContainer.get<IUsersRepository>(REPOSITORY_SYMBOLS.IUsersRepository);
  return (await usersRepository.getUserById(user.id)) as User & { subscriptions: Subscription[] };
};
