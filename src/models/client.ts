import { PrismaClient } from '@prisma/client';

// interface CustomNodeJsGlobal extends NodeJSGlobal
declare const global: Global & {
  prisma: PrismaClient;
};

const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV === 'development') global.prisma = prisma;

const CATEGORY_MODEL_NAME = 'Category';
const EXPENSE_MODEL_NAME = 'Expense';
// Middlewares for soft delete

prisma.$use(async (params, next) => {
  const isModelWithSoftDelete = [CATEGORY_MODEL_NAME, EXPENSE_MODEL_NAME].includes(params.model ?? '');

  if (isModelWithSoftDelete) {
    if (params.action === 'findUnique' || params.action === 'findFirst') {
      // Change to findFirst - you cannot filter
      // by anything except ID / unique with findUnique
      params.action = 'findFirst';
      // Add 'deleted' filter
      // ID filter maintained
      params.args.where['deleted'] = null;
    }
    if (params.action === 'findMany') {
      // Find many queries
      if (params.args.where) {
        if (params.args.where.deleted == undefined) {
          // Exclude deleted records if they have not been explicitly requested
          params.args.where['deleted'] = null;
        }
      } else {
        params.args['where'] = { deleted: null };
      }
    }
  }
  return next(params);
});

prisma.$use(async (params, next) => {
  const isModelWithSoftDelete = [CATEGORY_MODEL_NAME, EXPENSE_MODEL_NAME].includes(params.model ?? '');

  if (isModelWithSoftDelete) {
    if (params.action == 'update') {
      // Change to updateMany - you cannot filter
      // by anything except ID / unique with findUnique
      params.action = 'updateMany';
      // Add 'deleted' filter
      // ID filter maintained
      params.args.where['deleted'] = null;
    }
    if (params.action == 'updateMany') {
      if (params.args.where != undefined) {
        params.args.where['deleted'] = null;
      } else {
        params.args['where'] = { deleted: null };
      }
    }
  }
  return next(params);
});

prisma.$use(async (params, next) => {
  // Check incoming query type
  const isModelWithSoftDelete = [CATEGORY_MODEL_NAME, EXPENSE_MODEL_NAME].includes(params.model ?? '');
  if (isModelWithSoftDelete) {
    if (params.action == 'delete') {
      // Delete queries
      // Change action to an update
      params.action = 'update';
      params.args['data'] = { deleted: new Date() };
    }
    if (params.action == 'deleteMany') {
      // Delete many queries
      params.action = 'updateMany';
      if (params.args.data != undefined) {
        params.args.data['deleted'] = true;
      } else {
        params.args['data'] = { deleted: new Date() };
      }
    }
  }
  return next(params);
});

export default prisma;
