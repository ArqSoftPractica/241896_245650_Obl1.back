import express from 'express';
import { Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import { validate } from 'middlewares/validate';
import { RegisterAdminRequestSchema } from 'models/requests/RegisterAdminRequest';
import 'reflect-metadata';
import { IUsersService } from 'serviceTypes/IUsersService';
import { SERVICE_SYMBOLS } from '../serviceTypes/serviceSymbols';

@injectable()
class UsersController {
  public path = '/users';
  public usersRouter = express.Router();

  public constructor(@inject(SERVICE_SYMBOLS.IUsersService) private _usersService: IUsersService) {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.usersRouter.post(this.path, validate(RegisterAdminRequestSchema), this.registerAdmin);
  }

  public registerAdmin = async (req: Request, res: Response) => {
    try {
      const { body } = req;
      await this._usersService.registerAdmin({ body });
      res.status(201).send();
    } catch (err) {
      res.status(500).send(err);
    }
  };
}

export default UsersController;
