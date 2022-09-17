import { PrismaClient } from '@prisma/client';
type NodeJSGlobal = typeof global;

interface CustomNodeJsGlobal extends NodeJSGlobal {
  prisma: PrismaClient;
}

declare const customGlobal: CustomNodeJsGlobal;

const prisma = customGlobal.prisma || new PrismaClient();

if (process.env.NODE_ENV === 'development') customGlobal.prisma = prisma;

export default prisma;
