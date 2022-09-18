import { User } from '@prisma/client';
import { InviteUserRequest } from 'models/requests/InviteUserRequest';
import { RegisterAdminRequest } from 'models/requests/RegisterAdminRequest';

export interface IUsersService {
  registerAdmin(requestData: RegisterAdminRequest): Promise<void>;
  inviteUser(requestData: InviteUserRequest, user: User): Promise<void>;
}
