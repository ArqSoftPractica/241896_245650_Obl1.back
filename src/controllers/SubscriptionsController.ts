import { ResourceNotFoundError } from 'errors/ResourceNotFoundError';
import express, { Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import { AuthRequest, requireScopedAuth } from 'middlewares/requiresAuth';
import { validate } from 'middlewares/validate';
import { DeleteSubscriptionRequestSchema } from 'models/requests/subscriptions/DeleteSubscriptionRequest';
import {
  NewSubscriptionRequestSchema,
} from 'models/requests/subscriptions/NewSubscriptionRequest';
import 'reflect-metadata';
import { ISubscriptionsService } from 'serviceTypes/ISubscriptionsService';
import { SERVICE_SYMBOLS } from '../serviceTypes/serviceSymbols';

@injectable()
class SubscriptionsController {
  public path = '/subscriptions';
  public subscriptionsRouter = express.Router();

  public constructor(
    @inject(SERVICE_SYMBOLS.ISubscriptionsService) private _subscriptionsService: ISubscriptionsService,
  ) {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.subscriptionsRouter.post(
      this.path,
      requireScopedAuth('admin'),
      validate(NewSubscriptionRequestSchema),
      this.createSubscription,
    );
    this.subscriptionsRouter.delete(
      this.path + '/:id',
      requireScopedAuth('admin'),
      validate(DeleteSubscriptionRequestSchema),
      this.deleteSubscription,
    );
  }

  public createSubscription = async (req: Request, res: Response) => {
    try {
      const { body, user } = req as AuthRequest;
      const { categoryId, isSpendingSubscription } = body;
      await this._subscriptionsService.createSubscription(user, categoryId, isSpendingSubscription);

      res.status(201).json({
        message: 'Subscription created successfully',
      });
    } catch (err) {
      console.error(err);
      if (err instanceof ResourceNotFoundError) {
        res.status(err.code).json({
          message: err.message,
        });
        return;
      }
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  public deleteSubscription = async (req: Request, res: Response) => {
    try {
      const { params, user } = req as AuthRequest;
      const { id } = params;
      await this._subscriptionsService.deleteSubscription(user, +id);

      res.status(200).json({
        message: 'Subscription deleted successfully',
      });
    } catch (err) {
      console.error(err);
      if (err instanceof ResourceNotFoundError) {
        res.status(err.code).json({
          message: err.message,
        });
        return;
      }
      res.status(500).json({ message: 'Internal server error' });
    }
  };
}

export default SubscriptionsController;
