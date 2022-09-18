import { injectable, inject } from 'inversify';
import bcrypt from 'bcrypt';
import 'reflect-metadata';
import { REPOSITORY_SYMBOLS } from '../repositoryTypes/repositorySymbols';
import { IUsersService } from 'serviceTypes/IUsersService';
import { RegisterAdminRequest } from 'models/requests/RegisterAdminRequest';
import { IFamilyRepository } from 'repositoryTypes/IFamilyRepository';
import { IUsersRepository } from 'repositoryTypes/IUsersRepository';

@injectable()
class UsersService implements IUsersService {
  public constructor(
    @inject(REPOSITORY_SYMBOLS.IFamilyRepository) private familyRepository: IFamilyRepository,
    @inject(REPOSITORY_SYMBOLS.IUsersRepository) private usersRepository: IUsersRepository,
  ) {}

  public async registerAdmin(requestData: RegisterAdminRequest): Promise<void> {
    const { body } = requestData;
    const { familyName, email, password, name } = body;

    // const newFamily = await this.familyRepository.createFamily(familyName);
    const hashedPassword = await bcrypt.hash(password, 10);

    await this.usersRepository.createUser({
      email,
      name,
      password: hashedPassword,
      family: {
        connectOrCreate: {
          where: { name: familyName },
          create: { name: familyName },
        },
      },
      role: 'admin',
    });
  }
}

export default UsersService;
