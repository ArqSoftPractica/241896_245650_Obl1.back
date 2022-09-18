import { Role, User } from '@prisma/client';
import { LoginRequest } from 'models/requests/LoginRequest';

export default interface IAuthService {
  createToken(user: User): Promise<string>;
  verifyToken(token: string): Promise<User>;
  createInviteToken(user: User, email: string, role: Role): Promise<string>;
  login(requestData: LoginRequest): Promise<string>;
}
