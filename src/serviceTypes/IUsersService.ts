import { User } from '@prisma/client';
import { InviteUserRequest } from 'models/requests/InviteUserRequest';
import { RegisterAdminRequest } from 'models/requests/RegisterAdminRequest';
import { RegisterRequest } from 'models/requests/RegisterRequest';

export interface IUsersService {
  registerAdmin(requestData: RegisterAdminRequest): Promise<void>;
  registerUser(requestData: RegisterRequest): Promise<void>;
  inviteUser(requestData: InviteUserRequest, user: User): Promise<void>;
}
