import * as dotenv from 'dotenv';
import myContainer from './factory/inversify.config';
import { SERVICE_SYMBOLS } from './serviceTypes/serviceSymbols';
import { IVoteService } from './serviceTypes/IVoteService';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import log4js from 'log4js';
import VoteController from 'controllers/VoteController';
import UsersController from 'controllers/UsersController';

dotenv.config();

const logFile = process.env.LOG_FILE_PATH ?? `${__dirname}/log.txt`;

log4js.configure({
  appenders: { everything: { type: 'file', filename: logFile } },
  categories: { default: { appenders: ['everything'], level: 'all' } },
});

const logger = log4js.getLogger('everything');

console.log = (...args) => logger.info(...args);
console.error = (...args) => logger.error(...args);
console.warn = (...args) => logger.warn(...args);

const PORT: number = parseInt(process.env.PORT ?? ('3000' as string), 10);

const app = express();

app.use(
  morgan('tiny', {
    skip: (req, res) => res.statusCode > 400,
    stream: {
      write: (msg: string) => {
        logger.info(msg);
      },
    },
  }),
);

app.use(
  morgan('combined', {
    skip: (req, res) => res.statusCode < 400,
    stream: {
      write: (msg: string) => {
        logger.error(msg);
      },
    },
  }),
);

app.use(helmet());
app.use(cors());
app.use(express.json());

// const voteService = myContainer.get<IVoteService>(SERVICE_SYMBOLS.IVoteService);
// const voteController = new VoteController(voteService);

const usersController = new UsersController();

app.use('/api/v1', usersController.usersRouter);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}: http://localhost:${PORT}`);
});
