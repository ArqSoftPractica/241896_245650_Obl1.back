import client from 'models/client';
import { Expense, Prisma } from '@prisma/client';
import { injectable } from 'inversify';
import 'reflect-metadata';
import { IExpensesRepository } from 'repositoryTypes/IExpensesRepository';
import { ExpenseDTO } from 'models/responses/ExpenseDTO';
import { ExpensePerCategoryDTO } from 'models/responses/ExpensesPerCategoryDTO';

@injectable()
class ExpensesRepository implements IExpensesRepository {
  public async createExpense(expenseData: Prisma.ExpenseCreateInput): Promise<ExpenseDTO> {
    return await client.expense.create({
      data: expenseData,
      select: {
        id: true,
        amount: true,
        date: true,
        description: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
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

  public async findMany(params: Prisma.ExpenseFindManyArgs): Promise<ExpenseDTO[]> {
    return await client.expense.findMany(params);
  }

  public async getExpensesPerCategory(
    familyId: number,
    from: Date | undefined,
    to: Date | undefined,
  ): Promise<ExpensePerCategoryDTO[]> {
    const expensesPerCategory: ExpensePerCategoryDTO[] = await client.$queryRaw`
      SELECT
        category.id,
        category.name,
        SUM(expense.amount) AS totalAmount
      FROM
        expense
      INNER JOIN category ON expense.categoryId = category.id
      WHERE
        category.familyId = ${familyId}
        AND category.deleted IS NULL
        AND expense.deleted IS NULL
        AND expense.date >= ${from || '1900-01-01'}
        AND expense.date <= ${to || '2100-01-01'}
      GROUP BY
        category.id
    `;
    return expensesPerCategory;
  }
}

export default ExpensesRepository;
