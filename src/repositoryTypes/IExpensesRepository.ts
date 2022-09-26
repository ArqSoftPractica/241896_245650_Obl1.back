import { Expense, Prisma } from '@prisma/client';
import { ExpenseDTO } from 'models/responses/ExpenseDTO';

export interface IExpensesRepository {
  createExpense(expenseData: Prisma.ExpenseCreateInput): Promise<ExpenseDTO>;
  updateExpense(expenseId: number, newValues: Prisma.ExpenseUpdateInput): Promise<Expense>;
  deleteExpense(expenseId: number): Promise<Expense>;
  findById(id: number): Promise<Expense | null>;
  isExpenseInFamily(expenseId: number, familyId: number): Promise<boolean>;
}
