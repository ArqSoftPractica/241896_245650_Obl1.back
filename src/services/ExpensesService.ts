import { injectable, inject } from 'inversify';
import 'reflect-metadata';
import { REPOSITORY_SYMBOLS } from '../repositoryTypes/repositorySymbols';
import { Expense, User } from '@prisma/client';
import { SERVICE_SYMBOLS } from 'serviceTypes/serviceSymbols';
import IAuthService from 'serviceTypes/IAuthService';
import { IExpensesService } from 'serviceTypes/IExpensesService';
import { CreateExpenseRequest } from 'models/requests/CreateExpenseRequest';
import { IExpensesRepository } from 'repositoryTypes/IExpensesRepository';
import { UpdateExpenseRequest } from 'models/requests/UpdateExpenseRequest';
import { ResourceNotFoundError } from 'errors/ResourceNotFoundError';

@injectable()
class ExpensesService implements IExpensesService {
  public constructor(
    @inject(REPOSITORY_SYMBOLS.IExpensesRepository) private expensesRepository: IExpensesRepository,
    @inject(SERVICE_SYMBOLS.IAuthService) private authService: IAuthService,
  ) {}

  public async createExpense(requestData: CreateExpenseRequest, user: User): Promise<Expense> {
    const { body } = requestData;
    const { amount, date, categoryId } = body;

    return this.expensesRepository.createExpense({
      amount,
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

  public async updateExpense(requestData: UpdateExpenseRequest): Promise<Expense> {
    const { body, params } = requestData;
    const { expenseId } = params;
    const { amount, date, categoryId } = body;

    const newValues = {
      amount,
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

  public async deleteExpense(expenseId: number): Promise<Expense> {
    return this.expensesRepository.deleteExpense(expenseId);
  }

  public async getExpenses(user: User): Promise<Expense[]> {
    // return this.expensesRepository.getExpenses(user);
    // TODO: family expenses
    throw new Error('Not implemented');
  }

  public async getExpense(expenseId: number): Promise<Expense | null> {
    const expense = this.expensesRepository.findById(expenseId);

    if (!!expense) throw new ResourceNotFoundError('Expense not found');

    return expense;
  }
}

export default ExpensesService;
