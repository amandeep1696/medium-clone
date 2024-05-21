import { Hono } from 'hono';
import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import { EnvironmentBindings } from '../types/bindings';

const user = new Hono<EnvironmentBindings>();

user.post('/signup', (c) => {
  const dbUrl = c.env.DATABASE_URL;
  return c.text('Sign up');
});

user.post('/signin', (c) => {
  return c.text('Sign in');
});

export default user;
