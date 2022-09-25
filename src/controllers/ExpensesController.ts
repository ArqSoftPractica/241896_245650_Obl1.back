import { User } from '@prisma/client';
import express from 'express';
import { Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import { requireScopedAuth } from 'middlewares/requiresAuth';
import { validate } from 'middlewares/validate';
import { CreateExpenseRequestSchema } from 'models/requests/CreateExpenseRequest';
import 'reflect-metadata';
import { IExpensesService } from 'serviceTypes/IExpensesService';
import { SERVICE_SYMBOLS } from '../serviceTypes/serviceSymbols';

@injectable()
class ExpensesController {
  public path = '/expenses';
  public expensesRouter = express.Router();

  public constructor(@inject(SERVICE_SYMBOLS.IExpensesService) private _expensesService: IExpensesService) {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.expensesRouter.post(
      this.path,
      requireScopedAuth('admin', 'user'),
      validate(CreateExpenseRequestSchema),
      this.createExpense,
    );
  }

  public createExpense = async (req: Request, res: Response) => {
    try {
      const { body, user } = req as Request & { user: User };

      const expense = await this._expensesService.createExpense({ body }, user);

      res.status(201).json({
        message: 'Expense created successfully',
        expense: {
          id: expense.id,
          amount: expense.amount,
          date: expense.date,
        },
      });
    } catch (err) {
      console.error(err);
      res.status(500).send(err);
    }
  };
}

export default ExpensesController;
