import { Context, Next } from 'hono';
import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import { createMiddleware } from 'hono/factory';
import { ContextVariables } from '../types/context';

export const prismaMiddleware = createMiddleware<{
  Variables: ContextVariables;
}>(async (c: Context, next: Next) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());
  c.set('prisma', prisma);
  await next();
});
