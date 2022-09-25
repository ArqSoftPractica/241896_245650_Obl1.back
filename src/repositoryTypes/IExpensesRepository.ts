import { Expense, Prisma } from '@prisma/client';

export interface IExpensesRepository {
  createExpense(expenseData: Prisma.ExpenseCreateInput): Promise<Expense>;
  updateExpense(expenseId: number, newValues: Prisma.ExpenseUpdateInput): Promise<Expense>;
  deleteExpense(expenseId: number): Promise<Expense>;
  findById(id: number): Promise<Expense | null>;
}
