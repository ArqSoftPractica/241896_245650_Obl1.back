import { Decimal } from '@prisma/client/runtime';

export interface ExpenseDTO {
  id: number;
  amount: Decimal;
  date: Date;
}
