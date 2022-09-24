import { injectable } from 'inversify';
import 'reflect-metadata';

import { IEmailService } from 'serviceTypes/IEmailService';

@injectable()
class EmailService implements IEmailService {
  private readonly FRONTEND_URL = process.env.FRONTEND_APP_URL ?? 'http://localhost:3000';

  private getInviteLink(token: string): string {
    return `${this.FRONTEND_URL}/register?token=${token}`;
  }

  private getInviteEmailBody(link: string): string {
    return `You have been invited to join the family. Please click on the link below to register and join the family. \n\n${link}`;
  }

  public async sendInviteEmail(email: string, token: string): Promise<void> {
    const link = this.getInviteLink(token);
    const body = this.getInviteEmailBody(link);

    const emailJobPayload = {
      to: email,
      subject: 'Family Invite',
      body,
    };

    console.log(email, token);
  }
}

export default EmailService;
