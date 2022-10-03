import { Expense, Prisma } from '@prisma/client';
import { ExpenseDTO } from 'models/responses/ExpenseDTO';
import { ExpensePerCategoryDTO } from 'models/responses/ExpensesPerCategoryDTO';

export interface IExpensesRepository {
  findMany(params: Prisma.ExpenseFindManyArgs): Promise<ExpenseDTO[]>;
  getTotalExpenses(familyId: number): Promise<number>;
  createExpense(expenseData: Prisma.ExpenseCreateInput): Promise<ExpenseDTO>;
  updateExpense(expenseId: number, newValues: Prisma.ExpenseUpdateInput): Promise<void>;
  deleteExpense(expenseId: number): Promise<Expense>;
  findById(id: number): Promise<Expense | null>;
  isExpenseInFamily(expenseId: number, familyId: number): Promise<boolean>;
  getExpensesPerCategory(
    familyId: number,
    from: Date | undefined,
    to: Date | undefined,
  ): Promise<ExpensePerCategoryDTO[]>;
}
