import { Expense, User } from '@prisma/client';
import { CreateExpenseRequest } from 'models/requests/CreateExpenseRequest';
import { GetExpensesRequest } from 'models/requests/GetExpensesRequest';
import { UpdateExpenseRequest } from 'models/requests/UpdateExpenseRequest';
import { ExpenseDTO } from 'models/responses/ExpenseDTO';

export interface IExpensesService {
  getExpenses(requestData: GetExpensesRequest, user: User): Promise<ExpenseDTO[]>;
  getExpense(expenseId: number, user: User): Promise<Expense | null>;
  createExpense(requestData: CreateExpenseRequest, user: User): Promise<ExpenseDTO>;
  updateExpense(requestData: UpdateExpenseRequest, user: User): Promise<Expense>;
  deleteExpense(expenseId: number, user: User): Promise<Expense>;
}
