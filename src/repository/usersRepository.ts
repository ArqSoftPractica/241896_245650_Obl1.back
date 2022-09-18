import client from 'models/client';
import { Prisma, User } from '@prisma/client';
import { injectable } from 'inversify';
import 'reflect-metadata';
import { IUsersRepository } from 'repositoryTypes/IUsersRepository';

@injectable()
class UsersRepository implements IUsersRepository {
  public async createUser(userData: Prisma.UserCreateInput): Promise<User> {
    return await client.user.create({ data: userData });
  }
}

export default UsersRepository;
