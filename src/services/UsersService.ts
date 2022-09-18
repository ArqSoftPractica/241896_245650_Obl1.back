import { injectable, inject } from 'inversify';
import crypto from 'crypto';
import 'reflect-metadata';
import { REPOSITORY_SYMBOLS } from '../repositoryTypes/repositorySymbols';
import { IUsersService } from 'serviceTypes/IUsersService';
import { RegisterAdminRequest } from 'models/requests/RegisterAdminRequest';
import { IUsersRepository } from 'repositoryTypes/IUsersRepository';
import { InviteUserRequest } from 'models/requests/InviteUserRequest';
import { User } from '@prisma/client';
import { SERVICE_SYMBOLS } from 'serviceTypes/serviceSymbols';
import IAuthService from 'serviceTypes/IAuthService';
import { IEmailService } from 'serviceTypes/IEmailService';

@injectable()
class UsersService implements IUsersService {
  public constructor(
    @inject(REPOSITORY_SYMBOLS.IUsersRepository) private usersRepository: IUsersRepository,
    @inject(SERVICE_SYMBOLS.IAuthService) private authService: IAuthService,
    @inject(SERVICE_SYMBOLS.IEmailService) private emailService: IEmailService,
  ) {}

  public async inviteUser(requestData: InviteUserRequest, user: User): Promise<void> {
    const { body } = requestData;
    const { email, role } = body;

    const inviteToken = await this.authService.createInviteToken(user, email, role);

    await this.emailService.sendInviteEmail(email, inviteToken);
  }

  public async registerAdmin(requestData: RegisterAdminRequest): Promise<void> {
    const { body } = requestData;
    const { familyName, email, password, name } = body;

    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

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
