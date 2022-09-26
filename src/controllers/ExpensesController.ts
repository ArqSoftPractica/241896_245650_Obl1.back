import { User } from '@prisma/client';
import { ResourceNotFoundError } from 'errors/ResourceNotFoundError';
import express from 'express';
import { Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import { requireScopedAuth } from 'middlewares/requiresAuth';
import { validate } from 'middlewares/validate';
import { CreateExpenseRequestSchema } from 'models/requests/CreateExpenseRequest';
import { DeleteExpenseRequestSchema } from 'models/requests/DeleteExpenseRequest';
import { GetExpenseRequestSchema } from 'models/requests/GetExpenseRequest';
import { GetExpensesRequest, GetExpensesRequestSchema } from 'models/requests/GetExpensesRequest';
import { UpdateExpenseRequestSchema } from 'models/requests/UpdateExpenseRequest';
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

    this.expensesRouter.get(
      `${this.path}/:expenseId`,
      requireScopedAuth('admin', 'user'),
      validate(GetExpenseRequestSchema),
      this.getExpense,
    );
    this.expensesRouter.put(
      `${this.path}/:expenseId`,
      requireScopedAuth('admin'),
      validate(UpdateExpenseRequestSchema),
      this.updateExpense,
    );
    this.expensesRouter.delete(
      `${this.path}/:expenseId`,
      requireScopedAuth('admin'),
      validate(DeleteExpenseRequestSchema),
      this.deleteExpense,
    );
    this.expensesRouter.get(
      this.path,
      requireScopedAuth('admin', 'user'),
      validate(GetExpensesRequestSchema),
      this.getExpenses,
    );
  }

  public createExpense = async (req: Request, res: Response) => {
    try {
      const { body, user } = req as Request & { user: User };

      const expense = await this._expensesService.createExpense({ body }, user);

      res.status(201).json({
        message: 'Expense created successfully',
        expense,
      });
    } catch (err) {
      console.error(err);
      if (err instanceof ResourceNotFoundError) {
        res.status(404).json({ message: err.message });
        return;
      }
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  public updateExpense = async (req: Request, res: Response) => {
    try {
      const { body, params, user } = req as Request & { user: User; params: { expenseId: string } };

      const expenseId = parseInt(params.expenseId);
      const expense = await this._expensesService.updateExpense(
        {
          body,
          params: {
            expenseId,
          },
        },
        user,
      );

      res.status(200).json({
        message: 'Expense updated successfully',
        expense: {
          id: expense.id,
          amount: expense.amount,
          date: expense.date,
        },
      });
    } catch (err) {
      console.error(err);
      if (err instanceof ResourceNotFoundError) {
        res.status(404).json({ message: err.message });
        return;
      }
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  public deleteExpense = async (req: Request, res: Response) => {
    try {
      const { params, user } = req as Request & { user: User; params: { expenseId: string } };

      const expenseId = parseInt(params.expenseId);
      const expense = await this._expensesService.deleteExpense(expenseId, user);

      res.status(200).json({
        message: 'Expense deleted successfully',
        expense: {
          id: expense.id,
          amount: expense.amount,
          date: expense.date,
        },
      });
    } catch (err) {
      console.error(err);
      if (err instanceof ResourceNotFoundError) {
        res.status(404).json({ message: err.message });
        return;
      }
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  public getExpenses = async (req: Request, res: Response) => {
    try {
      const { user, query } = req as Request & { user: User } & GetExpensesRequest;

      const expenses = await this._expensesService.getExpenses({ query }, user);

      res.status(200).json({
        message: 'Expenses fetched successfully',
        expenses,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  public getExpense = async (req: Request, res: Response) => {
    try {
      const { params, user } = req as Request & { user: User; params: { expenseId: string } };

      const expenseId = parseInt(params.expenseId);
      const expense = await this._expensesService.getExpense(expenseId, user);

      res.status(200).json({
        message: 'Expense fetched successfully',
        expense,
      });
    } catch (err) {
      console.error(err);

      if (err instanceof ResourceNotFoundError) {
        res.status(404).json({ message: err.message });
        return;
      }

      res.status(500).json({ message: 'Internal server error' });
    }
  };
}

export default ExpensesController;
