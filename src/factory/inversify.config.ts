import { Container } from 'inversify';
import { REPOSITORY_SYMBOLS } from '../repositoryTypes/repositorySymbols';
import { SERVICE_SYMBOLS } from '../serviceTypes/serviceSymbols';
import { IFamilyRepository } from 'repositoryTypes/IFamilyRepository';
import FamilyRepository from 'repository/familyRepository';
import { IUsersService } from 'serviceTypes/IUsersService';
import UsersService from 'services/UsersService';
import UsersRepository from 'repository/usersRepository';
import { IUsersRepository } from 'repositoryTypes/IUsersRepository';
import IAuthService from 'serviceTypes/IAuthService';
import AuthService from 'services/AuthService';
import { IEmailService } from 'serviceTypes/IEmailService';
import EmailService from 'services/EmailService';

const myContainer = new Container();
myContainer.bind<IFamilyRepository>(REPOSITORY_SYMBOLS.IFamilyRepository).to(FamilyRepository);
myContainer.bind<IUsersRepository>(REPOSITORY_SYMBOLS.IUsersRepository).to(UsersRepository);

myContainer.bind<IUsersService>(SERVICE_SYMBOLS.IUsersService).to(UsersService);
myContainer.bind<IAuthService>(SERVICE_SYMBOLS.IAuthService).to(AuthService);
myContainer.bind<IEmailService>(SERVICE_SYMBOLS.IEmailService).to(EmailService);

export default myContainer;
