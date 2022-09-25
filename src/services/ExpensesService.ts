import { injectable, inject } from 'inversify';
import 'reflect-metadata';
import { REPOSITORY_SYMBOLS } from '../repositoryTypes/repositorySymbols';
import { Expense, User } from '@prisma/client';
import { SERVICE_SYMBOLS } from 'serviceTypes/serviceSymbols';
import IAuthService from 'serviceTypes/IAuthService';
import { IExpensesService } from 'serviceTypes/IExpensesService';
import { CreateExpenseRequest } from 'models/requests/CreateExpenseRequest';
import { IExpensesRepository } from 'repositoryTypes/IExpensesRepository';

@injectable()
class ExpensesService implements IExpensesService {
  public constructor(
    @inject(REPOSITORY_SYMBOLS.IExpensesRepository) private expensesRepository: IExpensesRepository,
    @inject(SERVICE_SYMBOLS.IAuthService) private authService: IAuthService,
  ) { }

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
}

export default ExpensesService;
