import { Role } from '@prisma/client';
import { RegisterAdminRequest } from './requests/RegisterAdminRequest';

export type InvitePayload = {
  familyId: number;
  email: string;
  role: Role;
};
