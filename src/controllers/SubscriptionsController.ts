import { ResourceNotFoundError } from 'errors/ResourceNotFoundError';
import express, { Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import { AuthRequest, requireScopedAuth } from 'middlewares/requiresAuth';
import { validate } from 'middlewares/validate';
import { NewSubscriptionRequestSchema } from 'models/requests/NewSubscriptionRequest';
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
  }

  public createSubscription = async (req: Request, res: Response) => {
    try {
      const { body, user } = req as AuthRequest;
      const { categoryId, entity } = body;
      await this._subscriptionsService.createSubscription(user, categoryId, entity);

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
}

export default SubscriptionsController;
