import { Subscription, User } from '@prisma/client';
import myContainer from 'factory/inversify.config';
import { IUsersRepository } from 'repositoryTypes/IUsersRepository';
import { REPOSITORY_SYMBOLS } from 'repositoryTypes/repositorySymbols';
import { IEmailService, UpdateType } from 'serviceTypes/IEmailService';
import { SERVICE_SYMBOLS } from 'serviceTypes/serviceSymbols';

export async function sendExpenseUpdateMiddleware<T>(
  response: T & { category?: { id: number } },
  user: User,
  type: UpdateType,
) {
  const updatedUser = await loadSubscriptions(user);
  const isSubscribed = updatedUser.subscriptions.some(
    (sub) => sub.entity === type && sub.categoryId === response.category?.id,
  );

  console.log('isSubscribed', isSubscribed);
  if (isSubscribed) {
    const emailService = myContainer.get<IEmailService>(SERVICE_SYMBOLS.IEmailService);
    await emailService.sendCategoryBalanceUpdateEmail(user.email, type, response, type);
  }

  return response;
}

const loadSubscriptions = async (user: User): Promise<User & { subscriptions: Subscription[] }> => {
  const usersRepository = myContainer.get<IUsersRepository>(REPOSITORY_SYMBOLS.IUsersRepository);
  return (await usersRepository.getUserByEmail(user.email)) as User & { subscriptions: Subscription[] };
};
