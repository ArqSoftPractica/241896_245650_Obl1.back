import { User } from '@prisma/client';
import Queue from 'bull';
import dayjs from 'dayjs';
import myContainer from 'factory/inversify.config';
import { ICategoryRepository } from 'repositoryTypes/ICategoriesRepository';
import { IExpensesRepository } from 'repositoryTypes/IExpensesRepository';
import { REPOSITORY_SYMBOLS } from 'repositoryTypes/repositorySymbols';
import { IEmailService } from 'serviceTypes/IEmailService';
import { SERVICE_SYMBOLS } from 'serviceTypes/serviceSymbols';

export const SPENDING_LIMIT_QUEUE_NAME = 'spending-limit';

const queue = new Queue(SPENDING_LIMIT_QUEUE_NAME, process.env.REDIS_URL ?? '');
const calculateBalance = async (job: Queue.Job, done: any) => {
  const expensesRepository = myContainer.get<IExpensesRepository>(REPOSITORY_SYMBOLS.IExpensesRepository);
  const emailsService = myContainer.get<IEmailService>(SERVICE_SYMBOLS.IEmailService);
  const categoriesRepository = myContainer.get<ICategoryRepository>(REPOSITORY_SYMBOLS.ICategoriesRepository);

  const { user, categoryId } = job.data;
  const from = dayjs().startOf('month').toISOString();
  const to = dayjs().endOf('month').toISOString();

  console.log('Calculating balance for user', user.id);
  const castedUser = user as User;
  const expenses = await expensesRepository.getExpenses(castedUser.familyId, from, to);
  const sortedTransactions = expenses.sort((a, b) => a.date.getTime() - b.date.getTime());

  let balance = 0;

  sortedTransactions.forEach((transaction) => {
    balance += +transaction.amount as number;
  });

  const category = await categoriesRepository.findById(categoryId);
  if (!category) {
    done();
    return;
  }

  const hasReachedSpendingLimit = balance >= category?.monthlySpendingLimit;
  if (hasReachedSpendingLimit) {
    await emailsService.sendSpendingLimitAlertEmail(
      castedUser.email,
      category.name,
      category.monthlySpendingLimit,
      balance,
    );
  }

  done();
};

queue.process(calculateBalance);
queue.on('error', (err) => {
  console.log(err.message);
});

queue.on('success', (job, result) => {
  console.log('Job completed with result', job.id);
});
