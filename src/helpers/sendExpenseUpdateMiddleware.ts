import { Subscription, User } from '@prisma/client';
import myContainer from 'factory/inversify.config';
import { IEmailService, UpdateType } from 'serviceTypes/IEmailService';
import { SERVICE_SYMBOLS } from 'serviceTypes/serviceSymbols';

export async function sendExpenseUpdateMiddleware<T>(
  response: T & { category?: { id: number } },
  user: User & { subscriptions?: Subscription[] },
  type: UpdateType,
) {
  const isSubscribed = user.subscriptions?.some(
    (sub) => sub.entity === type && sub.categoryId === response.category?.id,
  );

  if (isSubscribed) {
    const emailService = myContainer.get<IEmailService>(SERVICE_SYMBOLS.IEmailService);
    await emailService.sendCategoryBalanceUpdateEmail(user.email, type, response, type);
  }

  return response;
}
