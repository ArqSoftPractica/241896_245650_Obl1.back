import { z } from 'zod';

import myContainer from 'factory/inversify.config';
import { REPOSITORY_SYMBOLS } from 'repositoryTypes/repositorySymbols';
import { IExpensesRepository } from 'repositoryTypes/IExpensesRepository';

const expensesRepository = myContainer.get<IExpensesRepository>(REPOSITORY_SYMBOLS.IExpensesRepository);

const expenseExists = async (expenseId: number) => {
  const expense = await expensesRepository.findById(expenseId);
  return !!expense;
};

export const DeleteExpenseRequestSchema = z.object({
  params: z.object({
    expenseId: z
      .preprocess((arg) => {
        if (typeof arg == 'string') return parseInt(arg);
      }, z.number())
      .refine(expenseExists, {
        message: 'Expense does not exist',
      }),
  }),
});

export type DeleteExpenseRequest = z.infer<typeof DeleteExpenseRequestSchema>;
