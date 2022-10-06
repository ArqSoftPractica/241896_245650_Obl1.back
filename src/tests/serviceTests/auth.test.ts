import { InvalidDataError } from 'errors/InvalidDataError';
import { LoginRequest } from 'models/requests/LoginRequest';
import { IFamilyRepository } from 'repositoryTypes/IFamilyRepository';
import { IUsersRepository } from 'repositoryTypes/IUsersRepository';
import AuthService from 'services/AuthService';

describe('Login', () => {
  // test('Login successfully', async () => {
  //   // const req: LoginRequest = {
  //   //   body: {
  //   //     email: 'secinarof@gmail.com',
  //   //     password: '123456',
  //   //   },
  //   // } as LoginRequest;
  //   // const user: User = {
  //   //   id: 1,
  //   //   email: 'secinarof@gmail.com',
  //   //   password: '123456',
  //   //   name: 'Fernanda',
  //   //   role: 'admin',
  //   //   familyId: 1,
  //   //   createdAt: new Date(),
  //   //   updatedAt: new Date(),
  //   // };
  //   // const mockUsersRepo = jest.fn<IUsersRepository, []>(() => ({
  //   //   createUser: jest.fn().mockReturnValue(Promise.resolve()),
  //   //   getUserByEmail: jest.fn().mockReturnValue(Promise.resolve(user)),
  //   // }));
  //   // const mockFamilyRepo = jest.fn<IFamilyRepository, []>();
  //   // const usersRepository = new mockUsersRepo();
  //   // const familyRepository = new mockFamilyRepo();
  //   // const authService = new AuthService(usersRepository, familyRepository);
  //   // await authService.login(req);
  //   // expect(usersRepository.getUserByEmail).toBeCalled();
  // });

  test('Login user not found', async () => {
    const req: LoginRequest = {
      body: {
        email: 'secinarof@gmail.com',
        password: '123456',
      },
    } as LoginRequest;

    const mockUsersRepo = jest.fn<IUsersRepository, []>(() => ({
      createUser: jest.fn().mockReturnValue(Promise.resolve()),
      getUserByEmail: jest.fn().mockImplementation(() => Promise.resolve(null)),
    }));

    const mockFamilyRepo = jest.fn<IFamilyRepository, []>(() => ({
      createFamily: jest.fn().mockReturnValue(Promise.resolve()),
      getFamilyById: jest.fn().mockImplementation(() => Promise.resolve(null)),
      findByFamilyName: jest.fn().mockImplementation(() => Promise.resolve(null)),
      updateFamily: jest.fn().mockReturnValue(Promise.resolve()),
      getByApiKey: jest.fn().mockImplementation(() => Promise.resolve(null)),
      findById: jest.fn().mockImplementation(() => Promise.resolve(null)),
    }));

    const usersRepository = new mockUsersRepo();
    const familyRepository = new mockFamilyRepo();
    const authService = new AuthService(usersRepository, familyRepository);

    expect(() => authService.login(req)).rejects.toThrow(InvalidDataError);
    expect(usersRepository.getUserByEmail).toBeCalled();
  });
});
