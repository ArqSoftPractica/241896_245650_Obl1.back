import { injectable } from 'inversify';
import 'reflect-metadata';
import { IVoteRepository } from '../repositoryTypes/IVoteRepository';

@injectable()
class VoteRepository implements IVoteRepository {
  saveVote(): string {
    return 'Hello, dependency injection!';
  }
}

export default VoteRepository;
