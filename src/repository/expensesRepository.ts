import client from 'models/client';
import { Expense, Prisma } from '@prisma/client';
import { injectable } from 'inversify';
import 'reflect-metadata';
import { IExpensesRepository } from 'repositoryTypes/IExpensesRepository';

@injectable()
class ExpensesRepository implements IExpensesRepository {
  public async createExpense(expenseData: Prisma.ExpenseCreateInput): Promise<Expense> {
    return await client.expense.create({ data: expenseData });
  }

  public async updateExpense(expenseId: number, newValues: Prisma.ExpenseUpdateInput): Promise<Expense> {
    return await client.expense.update({ where: { id: expenseId }, data: newValues });
  }

  public async findById(id: number): Promise<Expense | null> {
    return await client.expense.findUnique({ where: { id } });
  }

  public async deleteExpense(expenseId: number): Promise<Expense> {
    return await client.expense.delete({ where: { id: expenseId } });
  }
}

export default ExpensesRepository;
