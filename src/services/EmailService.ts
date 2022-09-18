import { injectable } from 'inversify';
import 'reflect-metadata';

import { IEmailService } from 'serviceTypes/IEmailService';

@injectable()
class UsersService implements IEmailService {
  public async sendInviteEmail(email: string, token: string): Promise<void> {
    console.log(email, token);
  }
}

export default UsersService;
