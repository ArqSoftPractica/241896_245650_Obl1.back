import { injectable, inject } from 'inversify';
import crypto from 'crypto';
import 'reflect-metadata';
import { REPOSITORY_SYMBOLS } from '../repositoryTypes/repositorySymbols';
import { IUsersService } from 'serviceTypes/IUsersService';
import { RegisterAdminRequest } from 'models/requests/RegisterAdminRequest';
import { IUsersRepository } from 'repositoryTypes/IUsersRepository';
import { InviteUserRequest } from 'models/requests/InviteUserRequest';
import { Expense, User } from '@prisma/client';
import { SERVICE_SYMBOLS } from 'serviceTypes/serviceSymbols';
import IAuthService from 'serviceTypes/IAuthService';
import { IEmailService } from 'serviceTypes/IEmailService';
import { RegisterRequest } from 'models/requests/RegisterRequest';
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
