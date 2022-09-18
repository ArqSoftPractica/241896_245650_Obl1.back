import { RegisterAdminRequest } from 'models/requests/RegisterAdminRequest';

export interface IUsersService {
  registerAdmin(requestData: RegisterAdminRequest): Promise<void>;
}
