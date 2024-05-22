import { PrismaClient } from '@prisma/client/edge';

export interface EnvironmentBindings {
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: string;
    prisma: PrismaClient;
  };
}
