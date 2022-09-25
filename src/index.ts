import * as dotenv from 'dotenv';
import myContainer from './factory/inversify.config';
import { SERVICE_SYMBOLS } from './serviceTypes/serviceSymbols';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import log4js from 'log4js';
import UsersController from 'controllers/UsersController';
import { IUsersService } from 'serviceTypes/IUsersService';
import IAuthService from 'serviceTypes/IAuthService';
import InvitesController from 'controllers/InvitesController';
import AuthController from 'controllers/AuthController';
import { IFamilyService } from 'serviceTypes/IFamilyService';

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

const usersService = myContainer.get<IUsersService>(SERVICE_SYMBOLS.IUsersService);
const usersController = new UsersController(usersService);

const authService = myContainer.get<IAuthService>(SERVICE_SYMBOLS.IAuthService);
const authController = new AuthController(authService);

const familyService = myContainer.get<IFamilyService>(SERVICE_SYMBOLS.IFamilyService);
const invitesController = new InvitesController(usersService, authService, familyService);

app.use('/api/v1', usersController.usersRouter);
app.use('/api/v1', invitesController.invitesRouter);
app.use('/api/v1', authController.authRouter);

// app.use((err: any, req: Request, res: Response, next: NextFunction) => {
//   console.error(err.stack);
//   res.status(500).send('Something broke!');
// });

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}: http://localhost:${PORT}`);
});
