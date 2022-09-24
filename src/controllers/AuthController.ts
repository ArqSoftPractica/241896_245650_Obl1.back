import { InvalidDataError } from 'errors/InvalidDataError';
import express from 'express';
import { Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import { validate } from 'middlewares/validate';
import { LoginRequestSchema } from 'models/requests/LoginRequest';
import 'reflect-metadata';
import IAuthService from 'serviceTypes/IAuthService';
import { SERVICE_SYMBOLS } from '../serviceTypes/serviceSymbols';

import { User } from '@prisma/client';
import { requireScopedAuth } from 'middlewares/requiresAuth';

@injectable()
class AuthController {
  public path = '/auth';
  public authRouter = express.Router();

  public constructor(@inject(SERVICE_SYMBOLS.IAuthService) private _authService: IAuthService) {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.authRouter.post(this.path + '/login', validate(LoginRequestSchema), this.login);
    this.authRouter.put(this.path + '/api-key', requireScopedAuth('admin'), this.refreshApiKey);
    this.authRouter.get(this.path + '/api-key', requireScopedAuth('admin', 'user'), this.getApiKey);
  }

  public login = async (req: Request, res: Response) => {
    try {
      const { body } = req;
      const token = await this._authService.login({ body });
      res.status(200).json({
        token,
        message: 'Login successful',
      });
    } catch (err) {
      if (err instanceof InvalidDataError) {
        res.status(err.code).json({ message: 'Email or password is incorrect' });
      }

      res.status(500).send(err);
    }
  };

  public refreshApiKey = async (req: Request, res: Response) => {
    try {
      const { user } = req as Request & { user: User };
      const { familyId } = user;
      const apiKey = await this._authService.refreshApiKey(familyId);
      res.status(200).json({
        apiKey,
        message: 'Refresh successful',
      });
    } catch (err) {
      res.status(500).send(err);
    }
  };

  public getApiKey = async (req: Request, res: Response) => {
    try {
      const { user } = req as Request & { user: User };
      const { familyId } = user;
      const apiKey = await this._authService.getApiKey(familyId);
      res.status(200).json({
        apiKey,
        message: 'Get successful',
      });
    } catch (err) {
      res.status(500).send(err);
    }
  }
}

export default AuthController;
