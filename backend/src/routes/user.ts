import { Hono } from 'hono';
import { decode, sign, verify } from 'hono/jwt';
import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import { EnvironmentBindings } from '../types/bindings';
import { hashPassword } from '../utils/hashPassword';

const user = new Hono<EnvironmentBindings>();

user.post('/signup', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();

  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });

    if (existingUser) {
      c.status(409);
      return c.json({
        error: 'Email already exists',
      });
    }

    const { salt, hash } = await hashPassword(body.password);

    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: hash,
        salt: salt,
      },
    });

    const token = await sign({ id: user.id }, c.env.JWT_SECRET);

    c.status(200);
    return c.json({
      jwt: token,
    });
  } catch (e) {
    c.status(500);
    console.log(e);
    return c.json({ error: 'Internal server error' });
  }
});

user.post('/signin', (c) => {
  return c.text('Sign in');
});

export default user;
