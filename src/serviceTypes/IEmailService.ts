export interface IEmailService {
  sendInviteEmail(email: string, token: string): Promise<void>;
}
