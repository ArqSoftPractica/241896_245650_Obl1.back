import { z } from 'zod';

import myContainer from 'factory/inversify.config';
import { REPOSITORY_SYMBOLS } from 'repositoryTypes/repositorySymbols';
import { IExpensesRepository } from 'repositoryTypes/IExpensesRepository';

const expensesRepository = myContainer.get<IExpensesRepository>(REPOSITORY_SYMBOLS.IExpensesRepository);

const expenseExists = async (expenseId: number) => {
  const expense = await expensesRepository.findById(expenseId);
  return !!expense;
};

export const UpdateExpenseRequestSchema = z.object({
  params: z.object({
    expenseId: z.preprocess(
      (arg) => {
        if (typeof arg == 'string') return parseInt(arg);
      },
      z.number().refine(expenseExists, {
        message: 'Expense does not exist',
      }),
    ),
    // expenseId: z.number().refine(expenseExists, {
    //   message: 'Expense does not exist',
    // }),
  }),
  body: z.object({
    amount: z.number().min(0).optional(),
    date: z
      .preprocess((arg) => {
        if (typeof arg == 'string' || arg instanceof Date) return new Date(arg);
      }, z.date())
      .optional(),
    categoryId: z.number().min(1).optional(),
  }),
});

export type UpdateExpenseRequest = z.infer<typeof UpdateExpenseRequestSchema>;
