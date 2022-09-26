import { injectable, inject } from 'inversify';
import 'reflect-metadata';
import { REPOSITORY_SYMBOLS } from '../repositoryTypes/repositorySymbols';
import { Expense, User } from '@prisma/client';
import { IExpensesService } from 'serviceTypes/IExpensesService';
import { CreateExpenseRequest } from 'models/requests/CreateExpenseRequest';
import { IExpensesRepository } from 'repositoryTypes/IExpensesRepository';
import { UpdateExpenseRequest } from 'models/requests/UpdateExpenseRequest';
import { ResourceNotFoundError } from 'errors/ResourceNotFoundError';
import { ICategoryRepository } from 'repositoryTypes/ICategoriesRepository';
import { ExpenseDTO } from 'models/responses/ExpenseDTO';

@injectable()
class ExpensesService implements IExpensesService {
  public constructor(
    @inject(REPOSITORY_SYMBOLS.IExpensesRepository) private expensesRepository: IExpensesRepository,
    @inject(REPOSITORY_SYMBOLS.ICategoriesRepository) private categoriesRepository: ICategoryRepository,
  ) {}

  private async checkCategoryIsInFamily(categoryId: number, familyId: number): Promise<boolean> {
    const category = await this.categoriesRepository.findById(categoryId);

    const isNotCategoryInFamily = !category || category.familyId !== familyId;
    if (isNotCategoryInFamily) throw new ResourceNotFoundError('Category not found');

    return true;
  }

  private async checkExpenseIsInFamily(expenseId: number, familyId: number): Promise<boolean> {
    const isExpenseInFamily = this.expensesRepository.isExpenseInFamily(expenseId, familyId);

    if (!isExpenseInFamily) throw new ResourceNotFoundError('Expense not found');

    return true;
  }

  public async createExpense(requestData: CreateExpenseRequest, user: User): Promise<ExpenseDTO> {
    const { body } = requestData;
    const { amount, date, categoryId, description } = body;

    await this.checkCategoryIsInFamily(categoryId, user.familyId);

    return this.expensesRepository.createExpense({
      amount,
      description,
      date: new Date(date),
      category: {
        connect: {
          id: categoryId,
        },
      },
      user: {
        connect: { id: user.id },
      },
    });
  }

  public async updateExpense(requestData: UpdateExpenseRequest, user: User): Promise<Expense> {
    const { body, params } = requestData;
    const { expenseId } = params;
    const { amount, date, categoryId, description } = body;

    await this.checkExpenseIsInFamily(expenseId, user.familyId);

    const newValues = {
      amount,
      description,
      date: date ? new Date(date) : undefined,
      category: categoryId
        ? {
            connect: {
              id: categoryId,
            },
          }
        : undefined,
    };

    return this.expensesRepository.updateExpense(expenseId, newValues);
  }

  public async deleteExpense(expenseId: number, user: User): Promise<Expense> {
    await this.checkExpenseIsInFamily(expenseId, user.familyId);
    return this.expensesRepository.deleteExpense(expenseId);
  }

  public async getExpenses(user: User): Promise<Expense[]> {
    // return this.expensesRepository.getExpenses(user);
    // TODO: family expenses
    throw new Error('Not implemented');
  }

  public async getExpense(expenseId: number, user: User): Promise<Expense | null> {
    await this.checkExpenseIsInFamily(expenseId, user.familyId);
    const expense = await this.expensesRepository.findById(expenseId);

    if (!expense) throw new ResourceNotFoundError('Expense not found');

    return expense;
  }
}

export default ExpensesService;
