import * as dotenv from 'dotenv';
import myContainer from './factory/inversify.config';
import { SERVICE_SYMBOLS } from './serviceTypes/serviceSymbols';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { createTerminus } from '@godaddy/terminus';
import log4js from 'log4js';
import UsersController from 'controllers/UsersController';
import { IUsersService } from 'serviceTypes/IUsersService';
import IAuthService from 'serviceTypes/IAuthService';
import InvitesController from 'controllers/InvitesController';
import AuthController from 'controllers/AuthController';
import { IFamilyService } from 'serviceTypes/IFamilyService';
import { ICategoriesService } from 'serviceTypes/ICategoriesService';
import CategoryController from 'controllers/CategoryController';
import { IExpensesService } from 'serviceTypes/IExpensesService';
import ExpensesController from 'controllers/ExpensesController';

import 'models/redisClient';
import dbClient from 'models/client';
import client from 'models/redisClient';

dotenv.config();

log4js.configure({
  appenders: { out: { type: 'stdout' } },
  categories: { default: { appenders: ['out'], level: 'all' } },
});

const logger = log4js.getLogger('out');

console.log = (...args) => logger.info(...args);
console.info = (...args) => logger.info(...args);
console.error = (...args) => logger.error(...args);
console.warn = (...args) => logger.warn(...args);

const PORT: number = parseInt(process.env.PORT ?? ('3000' as string), 10);

const app = express();

app.use(
  morgan('tiny', {
    skip: (req, res) => res.statusCode >= 400,
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

app.use(
  compression({
    level: 9,
  }),
);

app.use(helmet());
app.use(cors());
app.use(express.json());

//configure Terminus
const onSignal = () => {
  console.log('server is starting cleanup');
  return Promise.all([dbClient.$disconnect(), client.disconnect()]);
};

const onShutdown = () => {
  console.log('cleanup finished, server is shutting down');
  return Promise.resolve();
};

const healthCheck = async () => {
  try {
    const redisState = await client.ping();

    const dbState: [] =
      (await dbClient.$queryRaw`
      SELECT 1
    `) ?? [];

    if (redisState === 'PONG' && dbState.length > 0) {
      return {
        status: 'ok',
      };
    }

    return {
      status: 'error',
      details: {
        redis: redisState === 'PONG' ? 'ok' : 'error',
        db: dbState.length > 0 ? 'ok' : 'error',
      },
    };
  } catch (error: any) {
    return {
      status: 'error',
      details: {
        redis: 'error',
        db: 'error',
        error: error.message,
      },
    };
  }
};

const usersService = myContainer.get<IUsersService>(SERVICE_SYMBOLS.IUsersService);
const usersController = new UsersController(usersService);

const authService = myContainer.get<IAuthService>(SERVICE_SYMBOLS.IAuthService);
const authController = new AuthController(authService);

const familyService = myContainer.get<IFamilyService>(SERVICE_SYMBOLS.IFamilyService);
const invitesController = new InvitesController(usersService, authService, familyService);

const expensesService = myContainer.get<IExpensesService>(SERVICE_SYMBOLS.IExpensesService);
const expensesController = new ExpensesController(expensesService);

const categoriesService = myContainer.get<ICategoriesService>(SERVICE_SYMBOLS.ICategoriesService);
const categoriesController = new CategoryController(categoriesService);

app.use('/api/v1', usersController.usersRouter);
app.use('/api/v1', invitesController.invitesRouter);
app.use('/api/v1', authController.authRouter);
app.use('/api/v1', expensesController.expensesRouter);
app.use('/api/v1', categoriesController.categoriesRouter);

const server = app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}: http://localhost:${PORT}`);
});

createTerminus(server, {
  healthChecks: {
    '/': healthCheck,
  },
  onSignal,
  onShutdown,
});
