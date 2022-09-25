import client from 'models/client';
import { Expense, Prisma, User } from '@prisma/client';
import { injectable } from 'inversify';
import 'reflect-metadata';
import { IUsersRepository } from 'repositoryTypes/IUsersRepository';
import { IExpensesRepository } from 'repositoryTypes/IExpensesRepository';

@injectable()
class ExpensesRepository implements IExpensesRepository {
  public async createExpense(expenseData: Prisma.ExpenseCreateInput): Promise<Expense> {
    return await client.expense.create({ data: expenseData });
  }
}

export default ExpensesRepository;
