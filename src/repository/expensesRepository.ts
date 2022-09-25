import client from 'models/client';
import { Expense, Prisma } from '@prisma/client';
import { injectable } from 'inversify';
import 'reflect-metadata';
import { IExpensesRepository } from 'repositoryTypes/IExpensesRepository';
import { ExpenseDTO } from 'models/responses/ExpenseDTO';

@injectable()
class ExpensesRepository implements IExpensesRepository {
  public async createExpense(expenseData: Prisma.ExpenseCreateInput): Promise<ExpenseDTO> {
    return await client.expense.create({
      data: expenseData,
      select: {
        id: true,
        amount: true,
        date: true,
      },
    });
  }

  public async updateExpense(expenseId: number, newValues: Prisma.ExpenseUpdateInput): Promise<Expense> {
    return await client.expense.update({ where: { id: expenseId }, data: newValues });
  }

  public async findById(id: number): Promise<Expense | null> {
    return await client.expense.findFirst({ where: { id } });
  }

  public async deleteExpense(expenseId: number): Promise<Expense> {
    return await client.expense.delete({ where: { id: expenseId } });
  }

  public async isExpenseInFamily(expenseId: number, familyId: number): Promise<boolean> {
    const expense = await client.expense.findFirst({
      where: {
        id: expenseId,
        category: {
          family: {
            id: familyId,
          },
        },
      },
    });
    return !!expense;
  }
}

export default ExpensesRepository;
