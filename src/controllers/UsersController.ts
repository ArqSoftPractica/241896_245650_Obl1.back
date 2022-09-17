import express from 'express';
import { Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import { validate } from 'middlewares/validate';
import { RegisterAdminRequestSchema } from 'models/requests/RegisterAdminRequest';
import 'reflect-metadata';
import { SERVICE_SYMBOLS } from '../serviceTypes/serviceSymbols';

@injectable()
class UsersController {
  public path = '/users';
  public usersRouter = express.Router();

  // public constructor(@inject(SERVICE_SYMBOLS.IVoteService) private _voteService: IVoteService) {
  //   this.initializeRoutes();
  // }

  public constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.usersRouter.post(this.path, validate(RegisterAdminRequestSchema), this.registerAdmin);
  }

  public registerAdmin = async (req: Request, res: Response) => {
    res.json({
      message: 'Register success',
    });
  };
}

export default UsersController;
