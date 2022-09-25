import { Expense, Prisma } from '@prisma/client';

export interface IExpensesRepository {
  createExpense(expenseData: Prisma.ExpenseCreateInput): Promise<Expense>;
}
