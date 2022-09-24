import { Role, User } from '@prisma/client';
import { InvitePayload } from 'models/InvitePayload';
import { LoginRequest } from 'models/requests/LoginRequest';

export default interface IAuthService {
  createToken(user: User): Promise<string>;
  verifyToken(token: string): Promise<User>;
  createInviteToken(user: User, email: string, role: Role): Promise<string>;
  verifyInviteToken(token: string): Promise<InvitePayload>;
  login(requestData: LoginRequest): Promise<string>;
  refreshApiKey(familyId: number): Promise<string>;
  getApiKey(familyId: number): Promise<string>;
}
