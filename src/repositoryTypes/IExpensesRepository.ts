import { Expense, Prisma, User } from '@prisma/client';

export interface IExpensesRepository {
  createExpense(expenseData: Prisma.ExpenseCreateInput): Promise<Expense>;
}
