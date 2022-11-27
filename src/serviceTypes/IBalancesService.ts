import { User } from '@prisma/client';

export interface IBalancesService {
  getBalance(user: User): Promise<void>;
}
