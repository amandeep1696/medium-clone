import { Hono } from 'hono';
import { sign } from 'hono/jwt';
import { ContextBindings, ContextVariables } from '../types/context';
import { hashPassword, hexStringToUint8Array } from '../utils/hashPassword';
import { prismaMiddleware } from '../middleware/prismaMiddleware';

const user = new Hono<{
  Bindings: ContextBindings;
  Variables: ContextVariables;
}>();

user.use(prismaMiddleware);

user.post('/signup', async (c) => {
  const prisma = c.get('prisma');
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
    return c.json({ error: 'Internal server error' });
  }
});

user.post('/signin', async (c) => {
  const prisma = c.get('prisma');
  const body = await c.req.json();

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });

    if (!user) {
      c.status(404);
      return c.json({
        error: 'User not found',
      });
    }

    const salt = hexStringToUint8Array(user.salt);
    const { hash } = await hashPassword(body.password, salt);

    if (hash == user.password) {
      const token = await sign({ id: user.id }, c.env.JWT_SECRET);

      c.status(200);
      return c.json({
        jwt: token,
      });
    } else {
      c.status(401);
      return c.json({
        error: 'Invalid credentials',
      });
    }
  } catch (e) {
    c.status(500);
    return c.json({ error: 'Internal server error' });
  }
});

export default user;
