import { Container } from 'inversify';
import { REPOSITORY_SYMBOLS } from '../repositoryTypes/repositorySymbols';
import { SERVICE_SYMBOLS } from '../serviceTypes/serviceSymbols';
import { IFamilyRepository } from 'repositoryTypes/IFamilyRepository';
import FamilyRepository from 'repository/familyRepository';

const myContainer = new Container();
myContainer.bind<IFamilyRepository>(REPOSITORY_SYMBOLS.IFamilyRepository).to(FamilyRepository);

export default myContainer;
