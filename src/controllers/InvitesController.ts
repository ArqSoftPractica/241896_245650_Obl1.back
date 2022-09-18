import { User } from '@prisma/client';
import express from 'express';
import { Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import { requireScopedAuth } from 'middlewares/requiresAuth';
import { validate } from 'middlewares/validate';
import { InviteUserRequestSchema } from 'models/requests/InviteUserRequest';
import { RegisterRequestSchema } from 'models/requests/RegisterRequest';
import 'reflect-metadata';
import { IUsersService } from 'serviceTypes/IUsersService';
import { SERVICE_SYMBOLS } from '../serviceTypes/serviceSymbols';

@injectable()
class InvitesController {
  public path = '/invites';
  public invitesRouter = express.Router();

  public constructor(@inject(SERVICE_SYMBOLS.IUsersService) private _usersService: IUsersService) {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.invitesRouter.post(this.path, requireScopedAuth('admin'), validate(InviteUserRequestSchema), this.inviteUser);
    this.invitesRouter.put(this.path, validate(RegisterRequestSchema), this.acceptInvite);
  }

  public inviteUser = async (req: Request, res: Response) => {
    try {
      const { body, user } = req as Request & { user: User };
      await this._usersService.inviteUser({ body }, user);

      const { email } = body;
      res.status(201).json({
        message: `An invitation has been sent to the email address provided. (${email})`,
      });
    } catch (err) {
      res.status(500).send(err);
    }
  };

  public acceptInvite = async (req: Request, res: Response) => {
    try {
      const { body } = req;
      await this._usersService.registerUser({ body });

      res.status(201).json({
        message: `Your account has been created.`,
      });
    } catch (err) {
      res.status(500).send(err);
    }
  };
}

export default InvitesController;
