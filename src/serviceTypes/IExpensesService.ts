import { Expense, User } from '@prisma/client';
import { CreateExpenseRequest } from 'models/requests/CreateExpenseRequest';
import { UpdateExpenseRequest } from 'models/requests/UpdateExpenseRequest';

export interface IExpensesService {
  getExpenses(user: User): Promise<Expense[]>;
  getExpense(expenseId: number, user: User): Promise<Expense | null>;
  createExpense(requestData: CreateExpenseRequest, user: User): Promise<Expense>;
  updateExpense(requestData: UpdateExpenseRequest, user: User): Promise<Expense>;
  deleteExpense(expenseId: number, user: User): Promise<Expense>;
}
