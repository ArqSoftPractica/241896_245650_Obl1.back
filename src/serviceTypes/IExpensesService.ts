import { Expense, User } from '@prisma/client';
import { CreateExpenseRequest } from 'models/requests/CreateExpenseRequest';

export interface IExpensesService {
  createExpense(requestData: CreateExpenseRequest, user: User): Promise<Expense>;
}
