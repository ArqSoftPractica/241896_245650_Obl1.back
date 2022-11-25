import { InvalidDataError } from 'errors/InvalidDataError';
import { RegisterAdminRequest } from 'models/requests/register/RegisterAdminRequest';
import { IUsersRepository } from 'repositoryTypes/IUsersRepository';
import UsersService from 'services/UsersService';
import IAuthService from 'serviceTypes/IAuthService';
import { IEmailService } from 'serviceTypes/IEmailService';

describe('Register new administrator', () => {
  test('Register admin successfully', async () => {
    const req: RegisterAdminRequest = {
      body: {
        email: 'secinarof@gmail.com',
        password: '123456',
        name: 'Fernanda',
        familyName: 'Secinaro',
      },
    } as RegisterAdminRequest;

    const mockUsersRepo = jest.fn<IUsersRepository, []>(() => ({
      createUser: jest.fn().mockReturnValue(Promise.resolve()),
      getUserByEmail: jest.fn().mockReturnValue(Promise.resolve(null)),
    }));

    const mockAuth = jest.fn<IAuthService, []>();
    const mockEmail = jest.fn<IEmailService, []>();

    const usersRepository = new mockUsersRepo();
    const authService = new mockAuth();
    const emailService = new mockEmail();
    const usersController = new UsersService(usersRepository, authService, emailService);
    await usersController.registerAdmin(req);

    expect(usersRepository.createUser).toBeCalled();
    expect(usersRepository.getUserByEmail).toBeCalled();
  });

  test('Register admin with existent email', async () => {
    const req: RegisterAdminRequest = {
      body: {
        email: 'secinarof@gmail.com',
        password: '123456',
        name: 'Fernanda',
        familyName: 'Secinaro',
      },
    } as RegisterAdminRequest;

    const mockUsersRepo = jest.fn<IUsersRepository, []>(() => ({
      createUser: jest.fn().mockReturnValue(Promise.resolve()),
      getUserByEmail: jest.fn().mockReturnValue(Promise.resolve(42)),
    }));

    const mockAuth = jest.fn<IAuthService, []>();

    const mockEmail = jest.fn<IEmailService, []>();

    const usersRepository = new mockUsersRepo();
    const authService = new mockAuth();
    const emailService = new mockEmail();
    const usersController = new UsersService(usersRepository, authService, emailService);

    await expect(() => usersController.registerAdmin(req)).rejects.toThrow(InvalidDataError);
  });
});
