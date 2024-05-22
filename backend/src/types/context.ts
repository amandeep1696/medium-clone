import { PrismaClient } from '@prisma/client/edge';

export type ContextBindings = {
  DATABASE_URL: string;
  JWT_SECRET: string;
};

export type ContextVariables = {
  userId: string;
  prisma: PrismaClient;
};
