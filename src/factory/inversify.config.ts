import { Container } from 'inversify';
import { REPOSITORY_SYMBOLS } from '../repositoryTypes/repositorySymbols';
import { SERVICE_SYMBOLS } from '../serviceTypes/serviceSymbols';
import { IFamilyRepository } from 'repositoryTypes/IFamilyRepository';
import FamilyRepository from 'repository/familyRepository';
import { IUsersService } from 'serviceTypes/IUsersService';
import UsersService from 'services/UsersService';
import UsersRepository from 'repository/usersRepository';
import { IUsersRepository } from 'repositoryTypes/IUsersRepository';

const myContainer = new Container();
myContainer.bind<IFamilyRepository>(REPOSITORY_SYMBOLS.IFamilyRepository).to(FamilyRepository);
myContainer.bind<IUsersRepository>(REPOSITORY_SYMBOLS.IUsersRepository).to(UsersRepository);

myContainer.bind<IUsersService>(SERVICE_SYMBOLS.IUsersService).to(UsersService);

export default myContainer;
