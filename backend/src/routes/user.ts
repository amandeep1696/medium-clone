import { Hono } from 'hono';
import { sign } from 'hono/jwt';
import { ContextBindings, ContextVariables } from '../types/context';
import { hashPassword, hexStringToUint8Array } from '../utils/hashPassword';
import { prismaMiddleware } from '../middleware/prismaMiddleware';
import { signupInput, signinInput } from '@amansin97/medium-common';

// todo check all routes theough gpt again

const userRouter = new Hono<{
  Bindings: ContextBindings;
  Variables: ContextVariables;
}>();

userRouter.use(prismaMiddleware);

userRouter.post('/signup', async (c) => {
  const prisma = c.get('prisma');
  const body = await c.req.json();

  const { success } = signupInput.safeParse(body);
  if (!success) {
    c.status(400);
    return c.json({
      error: 'Inputs not correct',
    });
  }

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
        name: body.name || null,
        password: hash,
        salt: salt,
      },
    });

    // todo probably create token with expiry
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

userRouter.post('/signin', async (c) => {
  const prisma = c.get('prisma');
  const body = await c.req.json();

  const { success } = signinInput.safeParse(body);
  if (!success) {
    c.status(400);
    return c.json({
      error: 'Inputs not correct',
    });
  }

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

export default userRouter;
