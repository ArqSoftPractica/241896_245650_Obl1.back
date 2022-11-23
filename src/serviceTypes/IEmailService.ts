export type UpdateType = 'expense' | 'income';
export interface IEmailService {
  sendInviteEmail(email: string, token: string): Promise<void>;
  sendCategoryBalanceUpdateEmail(email: string, category: string, data: any, type: UpdateType): Promise<void>;
}
