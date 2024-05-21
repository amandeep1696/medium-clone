import { Hono } from 'hono';
import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';

const user = new Hono();

user.post('/signup', (c) => {
  return c.text('Sign up');
});

user.post('/signin', (c) => {
  return c.text('Sign in');
});

export default user;
