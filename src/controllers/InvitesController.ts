import { User } from '@prisma/client';
import { InvalidDataError } from 'errors/InvalidDataError';
import express from 'express';
import { Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import { requireScopedAuth } from 'middlewares/requiresAuth';
import { validate } from 'middlewares/validate';
import { GetInviteRequestSchema } from 'models/requests/GetInviteRequest';
import { InviteUserRequestSchema } from 'models/requests/InviteUserRequest';
import { RegisterRequestSchema } from 'models/requests/RegisterRequest';
import 'reflect-metadata';
import IAuthService from 'serviceTypes/IAuthService';
import { IFamilyService } from 'serviceTypes/IFamilyService';
import { IUsersService } from 'serviceTypes/IUsersService';
import { SERVICE_SYMBOLS } from '../serviceTypes/serviceSymbols';

@injectable()
class InvitesController {
  public path = '/invites';
  public invitesRouter = express.Router();

  public constructor(
    @inject(SERVICE_SYMBOLS.IUsersService) private _usersService: IUsersService,
    @inject(SERVICE_SYMBOLS.IAuthService) private _authService: IAuthService,
    @inject(SERVICE_SYMBOLS.IFamilyService) private _familyService: IFamilyService,
  ) {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.invitesRouter.post(this.path, requireScopedAuth('admin'), validate(InviteUserRequestSchema), this.inviteUser);
    this.invitesRouter.put(this.path, validate(RegisterRequestSchema), this.acceptInvite);
    this.invitesRouter.get(this.path, validate(GetInviteRequestSchema), this.readInvite);
  }

  public inviteUser = async (req: Request, res: Response) => {
    try {
      const { body, user } = req as Request & { user: User };
      await this._usersService.inviteUser({ body }, user);

      res.status(201).json({
        message: `Invite sent successfully`,
      });
    } catch (err) {
      res.status(500).json({ message: 'Internal server error' });
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
      if (err instanceof InvalidDataError) {
        res.status(err.code).json({
          message: err.message,
        });
        return;
      }
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  public readInvite = async (req: Request, res: Response) => {
    try {
      const { query } = req;

      const invite = await this._authService.verifyInviteToken(query.token as string);
      const family = await this._familyService.getFamily(invite.familyId);

      res.status(200).json({
        message: `Invite found successfully`,
        invite: {
          ...invite,
          family: {
            name: family.name,
            id: family.id,
          },
        },
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
}

export default InvitesController;
