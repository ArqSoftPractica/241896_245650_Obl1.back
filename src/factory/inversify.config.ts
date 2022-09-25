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
import { IFamilyService } from 'serviceTypes/IFamilyService';
import FamilyService from 'services/FamilyService';
import { ICategoriesService } from 'serviceTypes/ICategoriesService';
import CategoriesService from 'services/CategoriesService';
import { ICategoryRepository } from 'repositoryTypes/ICategoriesRepository';
import CategoriesRepository from 'repository/categoriesRepository';

const myContainer = new Container();
myContainer.bind<IFamilyRepository>(REPOSITORY_SYMBOLS.IFamilyRepository).to(FamilyRepository);
myContainer.bind<IUsersRepository>(REPOSITORY_SYMBOLS.IUsersRepository).to(UsersRepository);
myContainer.bind<ICategoryRepository>(REPOSITORY_SYMBOLS.ICategoriesRepository).to(CategoriesRepository);

myContainer.bind<IUsersService>(SERVICE_SYMBOLS.IUsersService).to(UsersService);
myContainer.bind<IAuthService>(SERVICE_SYMBOLS.IAuthService).to(AuthService);
myContainer.bind<IEmailService>(SERVICE_SYMBOLS.IEmailService).to(EmailService);
myContainer.bind<IFamilyService>(SERVICE_SYMBOLS.IFamilyService).to(FamilyService);
myContainer.bind<ICategoriesService>(SERVICE_SYMBOLS.ICategoriesService).to(CategoriesService);

export default myContainer;
