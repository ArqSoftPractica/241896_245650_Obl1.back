import { Expense, User } from '@prisma/client';
import { CreateExpenseRequest } from 'models/requests/CreateExpenseRequest';
import { InviteUserRequest } from 'models/requests/InviteUserRequest';
import { RegisterAdminRequest } from 'models/requests/RegisterAdminRequest';
import { RegisterRequest } from 'models/requests/RegisterRequest';

export interface IExpensesService {
  createExpense(requestData: CreateExpenseRequest, user: User): Promise<Expense>;
}
