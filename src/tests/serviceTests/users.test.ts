import { RegisterAdminRequest } from 'models/requests/RegisterAdminRequest';
import { IUsersRepository } from 'repositoryTypes/IUsersRepository';
import UsersService from 'services/UsersService';
import IAuthService from 'serviceTypes/IAuthService';
import { IEmailService } from 'serviceTypes/IEmailService';

// describe('Register new administrator', () => {
//   test('Register new admin successfully', () => {
//     const req: RegisterAdminRequest = {
//       body: {
//         email: 'secinarof@gmail.com',
//         password: '123456',
//         name: 'Fernanda',
//         familyName: 'Secinaro',
//       },
//     } as RegisterAdminRequest;

//     const mock = jest.fn<IUsersRepository, []>(() => ({
//       createUser: jest.fn().mockReturnValue(Promise.resolve()),
//       getUserByEmail: jest.fn().mockReturnValue(Promise.resolve(null)),
//     }));

//     const mockAuth = jest.fn<IAuthService, []>(() => ({
//       createInviteToken: jest.fn().mockReturnValue(Promise.resolve()),
//       verifyInviteToken: jest.fn().mockReturnValue(Promise.resolve()),
//       createToken: jest.fn().mockReturnValue(Promise.resolve()),
//       verifyToken: jest.fn().mockReturnValue(Promise.resolve()),
//       login: jest.fn().mockReturnValue(Promise.resolve()),
//       refreshApiKey: jest.fn().mockReturnValue(Promise.resolve()),
//       getApiKey: jest.fn().mockReturnValue(Promise.resolve()),
//     }));

//     const mockEmail = jest.fn<IEmailService, []>(() => ({
//       sendInviteEmail: jest.fn().mockReturnValue(Promise.resolve()),
//     }));

//     const usersRepository = new mock();
//     const authService = new mockAuth();
//     const emailService = new mockEmail();
//     const usersController = new UsersService(usersRepository, authService, emailService);

//     usersController.registerAdmin(req);
//   });
// });

describe('Register new administrator', () => {
  // expect(() => {
  test('Register admin with existent email', () => {
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

    usersController.registerAdmin(req);
  });
  // }).toThrow(InvalidDataError);
});
